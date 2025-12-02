from django.core.exceptions import ValidationError
from django.db import models

from apps.user.models import User


class Exam(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="exams",
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


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

    exam_file = models.FileField(upload_to="uploads/ai_exams/")
    answer_key_file = models.FileField(upload_to="uploads/ai_keys/")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    raw_json_output = models.JSONField(null=True, blank=True)

    def __str__(self) -> str:
        return f"ExamExtractionTask {self.id} - {self.status}"


class Edition(models.Model):
    year = models.PositiveIntegerField(unique=True)

    def __str__(self) -> str:
        return str(self.year)


class Theme(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name


class Question(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    has_image = models.BooleanField(default=False, blank=True)
    passage_text = models.TextField(blank=True)
    stem = models.TextField()
    correct_answer = models.CharField(max_length=1)
    theme = models.ForeignKey(
        Theme,
        on_delete=models.PROTECT,
        related_name="questions",
    )
    edition = models.ForeignKey(
        Edition,
        on_delete=models.PROTECT,
        related_name="questions",
    )

    def __str__(self) -> str:
        return self.stem[:60]

    def clean(self) -> None:
        super().clean()

        options_list = [ans.option for ans in self.answer_options.all()]

        if self.correct_answer not in options_list:
            msg = (
                "The correct answer must be one of the answer options "
                f"associated with this question. Available options: {options_list}"
            )
            raise ValidationError(msg)


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answer_options"
    )
    option = models.CharField(max_length=1)
    option_text = models.TextField(max_length=250)

    def __str__(self) -> str:
        return f"{self.option}) {self.option_text}"
