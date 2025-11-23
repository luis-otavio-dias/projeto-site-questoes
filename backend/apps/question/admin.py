from django.contrib import admin

from apps.question.models import Answer, Edition, Question, Theme


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
