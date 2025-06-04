from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.forms import AuthenticationForm
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

    return render(
        request,
        "user/register.html",
        context,
    )


def login_view(request):
    form = AuthForm(request)

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            messages.success(request, "Usuário logado")
            return redirect("question:index")
        messages.error(request, "Login inválido")

    context = {
        "form": form,
        "site_title": "Faça seu login",
    }

    return render(
        request,
        "user/login.html",
        context,
    )


@login_required(login_url="user:login")
def logout_view(request):
    auth.logout(request)
    return redirect("user:login")
