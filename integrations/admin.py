from django.contrib import admin
from integrations.models import ChatMessage


# Register your models here.
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = (
        "user_message",
        "bot_message",
        "timestamp",
    )
