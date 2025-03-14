from django.db import models


# Create your models here.
class Theme(models.Model):
    name = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return f"{self.name}"


class Answer(models.Model):
    question = models.ForeignKey(
        "Question",
        on_delete=models.CASCADE,
        default=None,
    )
    options = models.CharField(max_length=1, default=None)
    text = models.CharField(max_length=250, default=None)
    # correct = models.CharField(max_length=1, blank=False)


class Question(models.Model):
    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"

    statement = models.TextField(blank=False)
    # alternatives = models.ForeignKey(Answer, on_delete=models.CASCADE)
    correct_answer = models.CharField(max_length=1)
    theme = models.ForeignKey(Theme, on_delete=models.PROTECT)
