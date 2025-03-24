from django.shortcuts import render
from user.forms import RegisterForm


# Create your views here.
def register(request):
    form = RegisterForm()

    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()

    context = {
        "form": form,
    }

    return render(
        request,
        "user/user_register.html",
        context,
    )
