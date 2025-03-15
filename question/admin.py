from django.contrib import admin
from question.models import Question, Theme, Answer


# Register your models here.
class AnswerLinkInLine(admin.TabularInline):
    model = Answer
    extra = 4


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "stem", "correct_answer", "theme")
    list_display_links = ("id", "stem")
    delete_confirmation_template = (
        "id",
        "stem",
        "correct_answer",
        "theme",
    )
    inlines = (AnswerLinkInLine,)
