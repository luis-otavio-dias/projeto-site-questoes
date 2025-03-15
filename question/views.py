from django.shortcuts import render
from question.models import Question


# Create your views here.
def index(request):
    questions = Question.objects.all()

    context = {
        "questions": questions,
    }

    return render(
        request,
        "question/index.html",
        context,
    )
