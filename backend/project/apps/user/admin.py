from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from project.apps.user import models
from project.apps.question.models import Question


# admin.site.register(User, UserAdmin)


class FileInline(admin.TabularInline):
    model = models.File
    extra = 1


class QuestionInLine(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(models.File)
class FileAdmin(admin.ModelAdmin):
    list_display = ("user", "file")


@admin.register(models.User)
class CustomUserAdmin(UserAdmin):
    inlines = (FileInline, QuestionInLine)
    list_display = ("username", "email")
    # fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("files",)}),)
