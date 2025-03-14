from django.contrib import admin
from question.models import Question, Theme, Answer


# Register your models here.
class AnswerLinkInLine(admin.TabularInline):
    model = Answer


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("statement", "correct_answer", "theme")
    inlines = (AnswerLinkInLine,)
