from django.urls import path
from question import views

app_name = "question"

urlpatterns = [
    path("", views.index, name="index"),
    path("question/<int:question_id>/", views.question, name="question"),
]
