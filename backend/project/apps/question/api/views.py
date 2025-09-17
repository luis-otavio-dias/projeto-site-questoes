from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from project.apps.question.models import Question
from project.apps.question.api.serializers import QuestionSerializer


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getQuestions(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getQuestion(request, id):
    question = get_object_or_404(Question, id=id)
    serializer = QuestionSerializer(question, many=False)
    return Response(serializer.data)
