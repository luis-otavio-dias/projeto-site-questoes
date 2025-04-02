from django.shortcuts import render, get_object_or_404
from question.models import Question
from question.forms import AnswerForm


# Create your views here.
def index(request):
    questions = Question.objects.all()

    context = {
        "questions": questions,
        "site_title": "Início",
    }

    return render(
        request,
        "question/index.html",
        context,
    )


def question(request, question_id):
    single_question = get_object_or_404(Question, pk=question_id)
    form = AnswerForm(single_question.answer_options.all())
    site_title = f"{single_question.id}"

    context = {
        "single_question": single_question,
        "form": form,
        "site_title": site_title,
    }

    return render(
        request,
        "question/single_question.html",
        context,
    )


def answer_question(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    form = AnswerForm(question.answer_options.all(), request.POST)

    if form.is_valid():
        user_answer = form.cleaned_data["reply"]
        user_is_right = False

        if user_answer == question.correct_answer:
            message = "Você acertou!"
            user_is_right = True
        else:
            message = f"Resposta incorreta! \
                Alternativa correta {question.correct_answer}"

        return render(
            request,
            "question/result.html",
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
