import asyncio
from pathlib import Path
from typing import Any

from django.db import transaction
from rich import print

from apps.question.ai_agent import structure_question_data
from apps.question.models import Answer, Edition, Exam, Question, Theme


class AIAgentService:
    async def extract_questions_from_exam(
        self, exam_file_path: str, answer_key_file_path: str
    ) -> list[dict[str, Any]]:

        return await structure_question_data(
            exam_file_path, answer_key_file_path
        )


def process_exam_import(task_instance) -> None:
    try:
        service = AIAgentService()

        data = asyncio.run(
            service.extract_questions_from_exam(
                task_instance.exam_file.path,
                task_instance.answer_key_file.path,
            )
        )

        with transaction.atomic():
            exam_title = (
                f"Importação: {Path(task_instance.exam_file.name).stem}"
            )

            new_exam = Exam.objects.create(
                user=task_instance.user,
                title=exam_title,
            )

            task_instance.generated_exam = new_exam
            task_instance.save()

            for question_data in data:
                question = Question.objects.get_or_create(
                    exam=new_exam,
                    stem=question_data.get("statement", ""),
                    passage_text=question_data.get("passage_text", ""),
                    correct_answer=question_data.get("correct_option", ""),
                    has_image=question_data.get("image", False),
                    theme=question_data.get(
                        "theme",
                        Theme.objects.get_or_create(name="Not Classified")[0],
                    ),
                    edition=question_data.get(
                        "edition",
                        Edition.objects.get_or_create(year=0)[0],
                    ),
                )[0]

                for option_data in question_data.get("options", []):
                    Answer.objects.create(
                        question=question,
                        option=option_data,
                        option_text=question_data["options"][option_data],
                    )

            print(
                f"[bold green]✅ Exam import completed successfully![/]\n"
                f"Exam ID: {new_exam.id}"
                f" Total Questions: {new_exam.questions.count()}"
            )

    except Exception as e:
        print(f"Error processing exam import: {e}")
