from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from project.apps.question.models import Question
from project.apps.question.forms import AnswerForm


@login_required(login_url="user:login")
def index(request):
    questions = Question.objects.all()

    context = {
        "questions": questions,
        "site_title": "Início",
    }

    return render(
        request,
        "index.html",
        context,
    )


@login_required(login_url="user:login")
def question(request, question_id):
    single_question = get_object_or_404(Question, pk=question_id)
    form = AnswerForm(single_question.answer_options.all())
    site_title = f"{single_question.stem}"

    context = {
        "single_question": single_question,
        "form": form,
        "site_title": site_title,
    }

    return render(
        request,
        "single_question.html",
        context,
    )


def answer_question(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    form = AnswerForm(question.answer_options.all(), request.POST)

    if form.is_valid():
        user_answer = form.cleaned_data["reply"]

        if user_answer == question.correct_answer:
            message = "Resposta correta."
        else:
            message = "Resposta errada."

        return render(
            request,
            "result.html",
            {
                "question": question,
                "message": message,
            },
        )

    return render(
        request,
        "question/question.html",
        {
            "question": question,
        },
    )
