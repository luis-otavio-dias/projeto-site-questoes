from importlib import import_module

from django.apps import AppConfig


class QuestionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.question"

    def ready(self) -> None:
        import_module("apps.question.signals")
