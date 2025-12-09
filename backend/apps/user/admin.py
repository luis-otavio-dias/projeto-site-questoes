from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.user.models import File, User

# admin.site.register(User, UserAdmin)

# admin.site.register(User)


class FileInline(admin.TabularInline):
    model = File
    extra = 1


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "file_type", "file_upload")


# @admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    inlines = (FileInline,)
    list_display = ("email", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )

    search_fields = ("email",)


admin.site.register(User, CustomUserAdmin)
