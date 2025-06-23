from django.shortcuts import render, redirect


def home(request):
    user = request.user
    if user.is_authenticated:
        return redirect("question:index")
    return render(request, "home.html", {"site_title": "Home"})
