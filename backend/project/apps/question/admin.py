from django.contrib import admin
from project.apps.question.models import Question, Theme, Answer, Edition


# Register your models here.
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
