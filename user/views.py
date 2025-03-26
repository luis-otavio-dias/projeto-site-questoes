from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from user.forms import RegisterForm


# Create your views here.
def register(request):
    form = RegisterForm()

    messages.info(request, "texto qualquer")

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Usuário registrado")
            return redirect("question:index")

    context = {
        "form": form,
    }

    return render(
        request,
        "user/user_register.html",
        context,
    )


def login_view(request):
    form = AuthenticationForm(request)

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
