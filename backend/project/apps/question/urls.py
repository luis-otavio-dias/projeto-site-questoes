from django.urls import path

from project.apps.question.views import getQuestions, getQuestion

app_name = "question"

urlpatterns = [
    # API endpoints
    path("", getQuestions, name="questions"),
    path("<int:id>/", getQuestion, name="question_detail"),
]
