from django.urls import path

from apps.question.views import (
    ExamDetailView,
    ExamExtractionStatusView,
    ExamQuestionsView,
    QuestionDetailView,
    QuestionListView,
    UploadExamView,
)

app_name = "question"

urlpatterns = [
    path("", QuestionDetailView.as_view(), name="questions"),
    path("<int:id>/", QuestionListView.as_view(), name="question_detail"),
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
