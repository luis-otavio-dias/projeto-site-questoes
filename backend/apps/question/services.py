import base64
from pathlib import Path
from typing import Any

import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import IntegrityError, transaction
from pydantic import ValidationError
from rich import print

from apps.question.api_contract import ProcessingResponseContract
from apps.question.mappers import map_exam_contract_to_dto
from apps.question.models import (
    Exam,
    ExamExtractionTask,
    Question,
    QuestionImage,
)


class ExtractionPipelineError(Exception):
    """Raised when the external extraction API returns an error."""


def exam_pipeline_api(
    task_instance: ExamExtractionTask,
) -> dict[str, Any]:
    """Call the external FastAPI extraction pipeline.

    Returns the full JSON response dict:
    {"status": "success"|"error", "data": {...}, "error_message": ...}
    """
    api_url = f"{settings.EXTRACTION_API_URL}/api/v1/process-exam"

    exam_file_path = Path(task_instance.exam_file.path)

    files = {}
    with exam_file_path.open("rb") as exam_file:
        files["exam_pdf"] = (
            exam_file_path.name,
            exam_file.read(),
            "application/pdf",
        )

        if task_instance.answer_key_file:
            answer_key_file_path = Path(task_instance.answer_key_file.path)
            with answer_key_file_path.open("rb") as answer_key_file:
                files["answer_key_pdf"] = (
                    answer_key_file_path.name,
                    answer_key_file.read(),
                    "application/pdf",
                )

    response = requests.post(
        api_url,
        headers={"X-Api-Key": settings.EXTRACTION_API_KEY},
        files=files,
        timeout=600,
    )
    response.raise_for_status()

    response_data: dict[str, Any] = response.json()

    if response_data["status"] == "error":
        raise ExtractionPipelineError(
            response_data.get("error_message", "Unknown API error")
        )

    return response_data


def _save_question_images(
    question: Question,
    images_data: list[dict[str, Any]],
) -> None:
    """Decode base64 image payloads and save as QuestionImage instances."""
    for img_payload in images_data:
        filename = img_payload.get("filename", "image.jpg")
        content_b64 = img_payload.get("content_base64", "")
        mime_type = img_payload.get("mime_type", "image/jpeg")

        if not content_b64:
            continue

        image_bytes = base64.b64decode(content_b64)
        image_file = ContentFile(image_bytes, name=filename)

        QuestionImage.objects.create(
            question=question,
            image=image_file,
            filename=filename,
            mime_type=mime_type,
        )


def process_exam_import(task_instance: ExamExtractionTask) -> None:
    try:
        response_data = exam_pipeline_api(task_instance)

        task_instance.raw_json_output = response_data
        task_instance.save(update_fields=["raw_json_output"])

        validated = ProcessingResponseContract.model_validate(response_data)

        if not validated.data:
            print(
                "[bold red]API response validation failed"
                f"for task ID {task_instance.id}[/]"
            )
            task_instance.status = "FAILED"
            task_instance.save(update_fields=["status"])
            return

        exam_dto = map_exam_contract_to_dto(validated.data)

        with transaction.atomic():

            new_exam = Exam.objects.create(
                user=task_instance.user,
                name_base=exam_dto.name_base,
                name_sigle=exam_dto.name_sigle,
                variant=exam_dto.variant,
                year=exam_dto.year,
                style=exam_dto.style,
            )

            task_instance.generated_exam = new_exam
            task_instance.save(update_fields=["generated_exam"])

            for q_dto in exam_dto.questions:
                question = Question.objects.create(
                    exam=new_exam,
                    question_id=q_dto.question_id,
                    name=q_dto.name,
                    passage_text=q_dto.passage_text,
                    sources=q_dto.sources,
                    stem=q_dto.stem,
                    correct_answer=q_dto.correct_answer,
                    options=q_dto.options,
                    has_image=q_dto.has_image,
                    area=q_dto.area,
                    topic=q_dto.topic,
                )

                for img_dto in q_dto.images:
                    _save_question_images(
                        question,
                        [
                            {
                                "filename": img_dto.filename,
                                "content_base64": img_dto.content_base64,
                                "mime_type": img_dto.mime_type,
                            }
                        ],
                    )

            task_instance.status = "COMPLETED"
            task_instance.save(update_fields=["status"])
            print(
                f"[bold green]Exam import completed successfully![/]\n"
                f"Exam ID: {new_exam.id}"
                f" Total Questions: {new_exam.questions.count()}"
            )

    except (
        ExtractionPipelineError,
        requests.RequestException,
        ValidationError,
        IntegrityError,
        KeyError,
        Exception,
    ) as e:
        task_instance.status = "FAILED"
        task_instance.save(update_fields=["status"])
        print(f"[bold red]Error processing exam import: {e}[/]")
