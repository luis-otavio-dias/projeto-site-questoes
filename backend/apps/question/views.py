# API Views
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.question.models import Question
from apps.question.serializers import QuestionSerializer


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
