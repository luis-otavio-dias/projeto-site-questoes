from django.db import models
from django.core.exceptions import ValidationError


# Create your models here.
class Edition(models.Model):
    year = models.IntegerField(null=True)

    def __str__(self):
        return f"{self.year}"


class Theme(models.Model):
    name = models.CharField(
        max_length=50,
        blank=False,
    )

    def __str__(self):
        return f"{self.name}"


class Question(models.Model):
    stem = models.TextField(blank=False)
    correct_answer = models.CharField(max_length=1)
    theme = models.ForeignKey(
        Theme,
        on_delete=models.SET_DEFAULT,
        default="Sem tema",
    )
    edition = models.ForeignKey(
        Edition,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.stem}"

    def clean(self):
        super.clean()

        options_list = [ans.option for ans in self.answer_options.all()]

        if self.correct_answer not in options_list:
            raise ValidationError(
                "A alternativa correta não está entre as opções",
            )


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answer_options"
    )
    option = models.CharField(max_length=1)
    option_text = models.TextField(max_length=250)

    def __str__(self):
        return f"{self.option} {self.option_text}"
