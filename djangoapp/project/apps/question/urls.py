from django.urls import path
from project.apps.question import views

app_name = "question"

urlpatterns = [
    path("index/", views.index, name="index"),
    path("question/<int:question_id>/", views.question, name="question"),
    path(
        "question/<int:question_id>/result",
        views.answer_question,
        name="answer_question",
    ),
]
