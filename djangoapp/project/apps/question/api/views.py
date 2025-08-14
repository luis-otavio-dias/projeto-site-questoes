from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from project.apps.question.models import Question
from project.apps.question.api.serializers import QuestionSerializer


@api_view(["GET"])
def getQuestions(request):
    questions = Question.objects.all()
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getQuestion(request, id):
    question = get_object_or_404(Question, id=id)
    serializer = QuestionSerializer(question, many=False)
    return Response(serializer.data)
