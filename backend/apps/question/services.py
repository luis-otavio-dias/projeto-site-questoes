import asyncio
from pathlib import Path
from typing import Any

from django.db import transaction
from rich import print

from apps.question.ai_agent import structure_question_data
from apps.question.models import (
    Answer,
    Edition,
    Exam,
    ExamExtractionTask,
    Question,
    Theme,
)


class AIAgentService:
    async def extract_questions_from_exam(
        self, exam_file_path: str, answer_key_file_path: str
    ) -> list[dict[str, Any]]:

        return await structure_question_data(
            exam_file_path, answer_key_file_path
        )


def process_exam_import(task_instance: ExamExtractionTask) -> None:
    try:
        service = AIAgentService()

        data = asyncio.run(
            service.extract_questions_from_exam(
                task_instance.exam_file.path,
                task_instance.answer_key_file.path,
            )
        )

        if not data:
            print(
                f"[bold red]No questions extracted for task ID {task_instance.id}[/]"
            )
            task_instance.status = "FAILED"
            task_instance.save(update_fields=["status"])
            return

        with transaction.atomic():
            exam_title = str(Path(task_instance.exam_file.name).stem)

            if task_instance.title:
                exam_title = task_instance.title

            new_exam = Exam.objects.create(
                user=task_instance.user,
                title=exam_title,
                description=task_instance.description or "",
            )

            task_instance.generated_exam = new_exam
            task_instance.save()

            for question_data in data:
                edition_str = question_data.get("edition", "Not Identified")
                edition = Edition.objects.get_or_create(year=edition_str)[0]

                theme_str = question_data.get("theme", "Not Classified")
                theme = Theme.objects.get_or_create(name=theme_str)[0]

                question = Question.objects.get_or_create(
                    exam=new_exam,
                    stem=question_data.get("statement", ""),
                    passage_text=question_data.get("passage_text", ""),
                    correct_answer=question_data.get("correct_option", ""),
                    has_image=question_data.get("image", False),
                    theme=theme,
                    edition=edition,
                )[0]

                for option_data in question_data.get("options", []):
                    Answer.objects.create(
                        question=question,
                        option=option_data,
                        option_text=question_data["options"][option_data],
                    )

            task_instance.status = "COMPLETED"
            task_instance.save(update_fields=["status"])
            print(
                f"[bold green]Exam import completed successfully![/]\n"
                f"Exam ID: {new_exam.id}"
                f" Total Questions: {new_exam.questions.count()}"
            )

    except Exception as e:
        task_instance.status = "FAILED"
        task_instance.save(update_fields=["status"])
        print(f"Error processing exam import: {e}")
