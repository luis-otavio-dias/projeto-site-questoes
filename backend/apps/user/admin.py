from django.contrib import admin

from apps.user.models import User

# admin.site.register(User, UserAdmin)

admin.site.register(User)

# class FileInline(admin.TabularInline):
#     model = models.File
#     extra = 1


# class QuestionInLine(admin.TabularInline):
#     model = Question
#     extra = 1


# @admin.register(models.File)
# class FileAdmin(admin.ModelAdmin):
#     list_display = ("user", "file")


# @admin.register(models.User)
# class CustomUserAdmin(UserAdmin):
#     inlines = (FileInline, QuestionInLine)
#     list_display = ("username", "email")
#     # fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("files",)}),)
