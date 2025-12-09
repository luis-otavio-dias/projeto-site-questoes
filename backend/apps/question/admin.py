from django.contrib import admin

from apps.question.models import (
    Answer,
    Edition,
    Exam,
    ExamExtractionTask,
    Question,
    Theme,
)


class AnswerLinkInLine(admin.TabularInline):
    model = Answer
    extra = 1


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Edition)
class EditionAdmin(admin.ModelAdmin):
    list_display = ("year",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "stem", "correct_answer", "theme")
    list_display_links = ("id", "stem")
    inlines = (AnswerLinkInLine,)


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "user")
    list_display_links = ("id", "title")


@admin.register(ExamExtractionTask)
class ExamExtractionTaskAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "created_at")
    list_display_links = ("id",)
    readonly_fields = ("generated_exam",)
