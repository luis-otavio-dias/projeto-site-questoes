from django.shortcuts import render, get_object_or_404
from project.apps.question.models import Question
from project.apps.question.forms import AnswerForm


def index(request):
    questions = Question.objects.all()

    context = {
        "questions": questions,
        "site_title": "Home",
    }

    return render(
        request,
        "index.html",
        context,
    )


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
        user_is_right = False

        if user_answer == question.correct_answer:
            message = "Resposta correta."
            user_is_right = True
        else:
            message = f"Resposta errada. \
                Alternativa correta: {question.correct_answer}"

        return render(
            request,
            "result.html",
            {
                "question": question,
                "message": message,
                "is_right": user_is_right,
            },
        )

    return render(
        request,
        "question/question.html",
        {
            "question": question,
        },
    )
