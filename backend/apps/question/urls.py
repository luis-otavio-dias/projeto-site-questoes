from django.urls import path

from apps.question.views import (
    ExamExtractionStatusView,
    UploadExamView,
    get_question,
    get_questions,
)

app_name = "question"

urlpatterns = [
    path("", get_questions, name="questions"),
    path("<int:id>/", get_question, name="question_detail"),
    path("upload-exam/", UploadExamView.as_view(), name="upload_exam"),
    path(
        "tasks/<int:id>/status/",
        ExamExtractionStatusView.as_view(),
        name="exam_status",
    ),
]
