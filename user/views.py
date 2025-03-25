from django.shortcuts import render, redirect
from django.contrib import messages
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
