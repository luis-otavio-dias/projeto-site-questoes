# API Views
from django.db.models import Count
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.question.models import Exam, ExamExtractionTask, Question
from apps.question.serializers import (
    ExamExtractionTaskSerializer,
    ExamSerializer,
    QuestionSerializer,
)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_questions(request: HttpRequest) -> Response:
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_question(request: HttpRequest, _id: int) -> Response:
    question = get_object_or_404(Question, id=_id)
    serializer = QuestionSerializer(question, many=False)
    return Response(serializer.data)


class UploadExamView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ExamExtractionTask.objects.all()
    serializer_class = ExamExtractionTaskSerializer

    def perform_create(self, serializer: ModelSerializer) -> None:
        serializer.save(user=self.request.user)


class ExamExtractionStatusView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamExtractionTaskSerializer
    lookup_field = "id"

    def get_queryset(self) -> ExamExtractionTask:
        return ExamExtractionTask.objects.filter(user=self.request.user)


class ExamQuestionsView(ReadOnlyModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamSerializer

    def get_queryset(self) -> Question:
        return Exam.objects.filter(user=self.request.user).annotate(
            questions_count=Count("questions")
        )


class ExamDetailView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ExamSerializer
    lookup_field = "id"

    def get_queryset(self) -> Exam:
        return Exam.objects.filter(user=self.request.user)
