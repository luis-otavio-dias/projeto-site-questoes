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


def answer_question(request, question_id):
    question = get_object_or_404(Question, pk=question_id)

    if request.method == "POST":
        user_answer = request.POST.get("reply").strip().upper()
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
