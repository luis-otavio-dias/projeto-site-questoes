from django.db import models


# Create your models here.
class Theme(models.Model):
    name = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return f"{self.name}"


class Question(models.Model):
    stem = models.TextField(blank=False)
    correct_answer = models.CharField(max_length=1)
    theme = models.ForeignKey(Theme, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.stem}"


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answer_options"
    )
    option = models.CharField(max_length=1)
    option_text = models.TextField(max_length=250)

    def __str__(self):
        return f"{self.option} {self.option_text}"
