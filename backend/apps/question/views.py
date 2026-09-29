# API Views
from typing import TYPE_CHECKING, cast

from django.db.models import Count, QuerySet
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.serializers import BaseSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.question.models import Exam, ExamExtractionTask, Question
from apps.question.serializers import (
    ExamExtractionTaskSerializer,
    ExamSerializer,
    QuestionSerializer,
)

if TYPE_CHECKING:
    from apps.user.models import User


class QuestionDetailView(RetrieveAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = QuestionSerializer
    lookup_field = "id"

    def get_queryset(self) -> QuerySet[Question]:
        return Question.objects.all()


class QuestionListView(ReadOnlyModelViewSet):
    permission_classes = (IsAdminUser,)
    serializer_class = QuestionSerializer

    def get_queryset(self) -> QuerySet[Question]:
        return Question.objects.all()


class UploadExamView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ExamExtractionTask.objects.all()
    serializer_class = ExamExtractionTaskSerializer

    def perform_create(self, serializer: BaseSerializer) -> None:
        serializer.save(user=self.request.user)


class ExamExtractionStatusView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamExtractionTaskSerializer
    lookup_field = "id"

    def get_queryset(self) -> QuerySet[ExamExtractionTask]:
        return ExamExtractionTask.objects.filter(
            user=cast("User", self.request.user)
        )


class ExamQuestionsView(ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamSerializer

    def get_queryset(self) -> QuerySet[Exam]:
        return Exam.objects.filter(
            user=cast("User", self.request.user)
        ).annotate(questions_count=Count("questions"))


class ExamDetailView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamSerializer
    lookup_field = "id"

    def get_queryset(self) -> QuerySet[Exam]:
        return Exam.objects.filter(user=cast("User", self.request.user))
