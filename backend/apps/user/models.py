from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from apps.user.validators import validate_file_type


class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(
        self, email: str, password: str, **extra_fields: dict
    ) -> "User":
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            msg = "Users must have an email address"
            raise ValueError(msg)

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(
        self, email: str, password: str, **extra_fields: dict
    ) -> "User":
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(
        self, email: str, password: str, **extra_fields: dict
    ) -> "User":
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_superuser") is not True:
            msg = "Superuser must have is_superuser=True."
            raise ValueError(msg)

        if extra_fields.get("is_staff") is not True:
            msg = "Superuser must have is_staff=True."
            raise ValueError(msg)

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list = []  # noqa: RUF012

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self) -> str:
        return self.email


class File(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="files",
        null=True,
    )
    title = models.CharField(max_length=255, blank=True)
    file_type = models.CharField(
        max_length=50,
        blank=True,
        choices=(("csv", "CSV File"), ("pdf", "PDF File")),
    )
    file_upload = models.FileField(
        upload_to="files",
        validators=[validate_file_type],
        null=True,
    )

    def __str__(self) -> str:
        return self.title or self.file_upload.name

    def save(self, *args: tuple, **kwargs: dict) -> None:
        if self.file_upload:
            file_extension = self.file_upload.name.split(".")[-1].lower()
            if file_extension in ["csv", "pdf"]:
                self.file_type = file_extension
        super().save(*args, **kwargs)
