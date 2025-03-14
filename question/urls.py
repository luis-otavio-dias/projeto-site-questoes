from django.urls import path
from question.views import index

app_name = "question"

urlpatterns = [
    path("", index, name="index"),
]
