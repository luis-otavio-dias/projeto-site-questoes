import threading

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.question.models import ExamExtractionTask
from apps.question.services import process_exam_import


@receiver(post_save, sender=ExamExtractionTask)
def trigger_ai_processing(sender, instance, created, **kwargs) -> None:
    if created and instance.status == "PENDING":
        instance.status = "PROCESSING"
        instance.save(update_fields=["status"])

        # Threading nativo do Python
        task_thread = threading.Thread(
            target=process_exam_import, args=(instance,)
        )
        task_thread.daemon = True
        task_thread.start()
