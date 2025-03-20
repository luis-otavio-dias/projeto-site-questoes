from django.urls import path
from integrations import views

app_name = "integrations"

urlpatterns = [
    path("chatbot/", views.chat_bot, name="chat_bot"),
]
