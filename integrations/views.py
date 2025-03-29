from django.shortcuts import render
from django.utils.timezone import now
from integrations.forms import ChatBotForm
from integrations.models import ChatMessage
from integrations.services import deepseek_api as ds


# Create your views here.
def chat_bot(request):
    user_message, response, timestamp = None, None, None
    sent_message = False

    if request.method == "POST":
        form = ChatBotForm(request.POST)
        if form.is_valid():
            user_message = form.cleaned_data["message"]
            response = ds.send_message(user_message)
            timestamp = now()
            sent_message = True
            ChatMessage.objects.create(
                user_message=user_message,
                bot_message=response,
                timestamp=timestamp,
            )
    else:
        form = ChatBotForm()

    context = {
        "site_title": "Virtual Assistant",
        "form": form,
        "response": response,
        "timestamp": timestamp,
        "sent_message": sent_message,
        "user_message": user_message,
    }

    return render(request, "integrations/chat.html", context)


# def chat(request):
#     return render(request, "integrations/chat.html")
