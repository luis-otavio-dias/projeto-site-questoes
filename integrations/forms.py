from django import forms


class ChatBotForm(forms.Form):
    message = forms.CharField(
        label="",
        max_length=2000,
        widget=forms.TextInput(
            attrs={
                "class": "message-input",
                "placeholder": "Escreva algo...",
            },
        ),
    )
