from django.urls import path
from project.apps.question import views
from project.apps.question.api.views import getQuestions, getQuestion

app_name = "question"

urlpatterns = [
    path("index/", views.index, name="index"),
    path("question/<int:question_id>/", views.question, name="question"),
    path(
        "question/<int:question_id>/result",
        views.answer_question,
        name="answer_question",
    ),
    path("api/questions/", getQuestions, name="questions"),
    path("api/questions/<int:id>/", getQuestion, name="question_detail"),
]
