from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.decorators import login_required
from project.apps.user.forms import RegisterForm, AuthForm


def register(request):
    form = RegisterForm()

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Usuário registrado")
            return redirect("user:login")

    context = {
        "form": form,
        "site_title": "Crie sua conta",
    }

    return render(request, "register.html", context)


def login_view(request):
    form = AuthForm(request)

    if request.method == "POST":
        form = AuthForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            return redirect("question:index")

        messages.error(request, "Username ou senha inválidos")
        return redirect("user:login")

    context = {
        "form": form,
        "site_title": "Faça seu login",
    }

    return render(request, "login.html", context)


@login_required(login_url="user:login")
def logout_view(request):
    auth.logout(request)
    return redirect("user:login")


def add_questions(request):

    return render(request, "add_questions.html")
