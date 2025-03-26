from django.shortcuts import render
from integrations.forms import ChatBotForm
from integrations.services import deepseek_api as ds


# Create your views here.
def chat_bot(request):
    response = FileNotFoundError

    if request.method == "POST":
        form = ChatBotForm(request.POST)
        if form.is_valid():
            user_message = form.cleaned_data["message"]
            response = ds.send_message(user_message)
    else:
        form = ChatBotForm()

    context = {
        "site_title": "Virtual Assistant",
        "form": form,
        "response": response,
    }

    return render(request, "integrations/chat.html", context)


# def chat(request):
#     return render(request, "integrations/chat.html")
