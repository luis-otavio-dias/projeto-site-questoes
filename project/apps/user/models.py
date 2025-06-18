from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    files = models.FileField(upload_to="media/files", blank=True, null=True)
