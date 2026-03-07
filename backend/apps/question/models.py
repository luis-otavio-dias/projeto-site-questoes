from django.core.exceptions import ValidationError
from django.db import models

from apps.user.models import User


class Exam(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="exams",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    name_base = models.CharField(max_length=150, blank=True)
    name_sigle = models.CharField(max_length=50, blank=True)
    variant = models.CharField(max_length=150, blank=True)
    year = models.CharField(max_length=4, blank=True)
    style = models.CharField(max_length=50, blank=True)
    total_questions = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.name_base


class ExamExtractionTask(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    generated_exam = models.OneToOneField(
        Exam,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="extraction_task",
    )
    title = models.CharField(max_length=150, blank=True)
    description = models.TextField(max_length=500, blank=True)

    exam_file = models.FileField(upload_to="uploads/ai_exams/")
    answer_key_file = models.FileField(
        upload_to="uploads/ai_keys/", blank=True, null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    raw_json_output = models.JSONField(null=True, blank=True)

    def __str__(self) -> str:
        return f"ExamExtractionTask {self.id} - {self.status}"


class Question(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    area = models.CharField(max_length=100, blank=True)
    topic = models.CharField(max_length=100, blank=True)
    question_id = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=150, blank=True)
    passage_text = models.TextField(blank=True)
    sources = models.JSONField(
        default=list,
        help_text="['Source 1', 'Source 2']",
    )
    has_image = models.BooleanField(default=False, blank=True)
    stem = models.TextField()
    correct_answer = models.CharField(max_length=1)
    options = models.JSONField(
        default=list,
        help_text="[{'label': 'A', 'text': 'Option A text'}, ...]",
    )

    def __str__(self) -> str:
        return self.stem[:60]

    def clean(self) -> None:
        super().clean()

        if not isinstance(self.options, list):
            msg = "Options must be a list of answer choices."
            raise ValidationError(msg)

        labels = []
        for option in self.options:
            if not isinstance(option, dict):
                msg = "Each option must be a dictionary with 'label' and 'text' keys."
                raise ValidationError(msg)
            if "label" not in option or "text" not in option:
                msg = "Each option must contain 'label' and 'text' keys."
                raise ValidationError(msg)
            labels.append(option["label"])

        if self.correct_answer not in labels:
            msg = (
                "The correct answer must be one of the answer options "
                f"associated with this question. Available options: {labels}"
            )
            raise ValidationError(msg)


class QuestionImage(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="uploads/question_images/")
    filename = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=50, default="image/jpeg")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.filename} (Q{self.question_id})"
