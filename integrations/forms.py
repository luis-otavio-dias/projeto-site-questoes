from django import forms


class ChatBotForm(forms.Form):
    message = forms.CharField(
        label="Digite sua mensagem",
        max_length=500,
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Escreva algo...",
            },
        ),
    )
