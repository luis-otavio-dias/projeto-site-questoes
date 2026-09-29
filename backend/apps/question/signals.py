import threading
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.question.models import ExamExtractionTask
from apps.question.services import process_exam_import


@receiver(post_save, sender=ExamExtractionTask)
def trigger_ai_processing(
    sender: type[ExamExtractionTask],
    instance: ExamExtractionTask,
    created: bool,  # noqa: FBT001
    **kwargs: Any,
) -> None:
    if created and instance.status == "PENDING":
        instance.status = "PROCESSING"
        instance.save(update_fields=["status"])

        task_thread = threading.Thread(
            target=process_exam_import, args=(instance,)
        )
        task_thread.daemon = True
        task_thread.start()
