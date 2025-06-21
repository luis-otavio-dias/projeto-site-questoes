from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class File(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="files",
    )
    file = models.FileField(upload_to="files")

    def __str__(self):
        return self.file
