from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from project.apps.user import models


# admin.site.register(User, UserAdmin)


class FileInline(admin.TabularInline):
    model = models.File
    extra = 1


@admin.register(models.File)
class FileAdmin(admin.ModelAdmin):
    list_display = ("user", "file")


@admin.register(models.User)
class CustomUserAdmin(UserAdmin):
    inlines = (FileInline,)
    list_display = ("username", "email")
    # fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("files",)}),)
