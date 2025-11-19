from django.urls import path

from apps.question.views import get_question, get_questions

app_name = "question"

urlpatterns = [
    path("", get_questions, name="questions"),
    path("<int:id>/", get_question, name="question_detail"),
]
