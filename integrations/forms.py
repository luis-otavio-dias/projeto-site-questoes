from django import forms


class ChatBotForm(forms.Form):
    message = forms.CharField(
        max_length=500,
        widget=forms.TextInput(
            attrs={
                "class": "message-input",
                "placeholder": "Escreva algo...",
            },
        ),
    )
