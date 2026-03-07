from django.contrib import admin

from apps.question.models import (
    Exam,
    ExamExtractionTask,
    Question,
    QuestionImage,
)


class QuestionImageInline(admin.TabularInline):
    model = QuestionImage
    extra = 0
    readonly_fields = ("image", "filename", "mime_type", "created_at")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "stem", "correct_answer", "area")
    list_display_links = ("id", "stem")
    inlines = (QuestionImageInline,)


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name_base")
    list_display_links = ("id", "name_base")


@admin.register(ExamExtractionTask)
class ExamExtractionTaskAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "created_at")
    list_display_links = ("id",)
    readonly_fields = ("generated_exam", "raw_json_output")


@admin.register(QuestionImage)
class QuestionImageAdmin(admin.ModelAdmin):
    list_display = ("id", "filename", "question", "mime_type", "created_at")
    list_display_links = ("id", "filename")
    readonly_fields = ("created_at",)
