from django.shortcuts import render, get_object_or_404
from question.models import Question


# Create your views here.
def index(request):
    questions = Question.objects.all()

    context = {
        "questions": questions,
        "site_title": "Title - ",
    }

    return render(
        request,
        "question/index.html",
        context,
    )


def question(request, question_id):
    single_question = get_object_or_404(Question, pk=question_id)
    site_title = f"{single_question.id}"

    context = {
        "single_question": single_question,
        "site_title": site_title,
    }

    return render(
        request,
        "question/single_question.html",
        context,
    )
