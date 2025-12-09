from django.urls import path

from apps.question.views import (
    ExamDetailView,
    ExamExtractionStatusView,
    ExamQuestionsView,
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
    path(
        "exams/",
        ExamQuestionsView.as_view({"get": "list"}),
        name="exams_list",
    ),
    path(
        "exams/<int:id>/",
        ExamDetailView.as_view(),
        name="exam_detail",
    ),
]
