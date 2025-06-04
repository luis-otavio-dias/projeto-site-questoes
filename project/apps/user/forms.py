from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class RegisterForm(UserCreationForm):
    first_name = forms.CharField(
        max_length=60,
        min_length=2,
        required=False,
        error_messages={
            "min_length": "Seu nome precisa ter pelo menos 2 letras.",
            "max_lenght": "Seu nome não pode ultrapassar 60 letras.",
        },
        widget=forms.TextInput({"placeholder": "Nome"}),
    )

    username = forms.CharField(
        max_length=60,
        min_length=2,
        required=True,
        help_text=("Obrigatório. Letras, números e @/./+/-/_ apenas.",),
        error_messages={
            "min_length": "Seu username precisa ter pelo menos 2 caracteres.",
            "max_lenght": "Seu username não pode ter mais de 60 caracteres. ",
        },
        widget=forms.TextInput({"placeholder": "Username"}),
    )

    password1 = forms.CharField(
        strip=False,
        widget=forms.PasswordInput({"placeholder": "Senha"}),
        help_text=(
            "Sua senha precisa conter pelo menos 8 caracteres.",
            "Sua senha não pode ser inteiramente numérica.",
        ),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].widget.attrs.update(
            {"placeholder": "E-mail"},
        )
        self.fields["password2"].widget.attrs.update(
            {"placeholder": "Confirmar senha"},
        )
        self.fields["password2"].help_text = ("Insira a senha novamente.",)

    class Meta:
        model = User
        fields = [
            "first_name",
            "email",
            "username",
            "password1",
            "password2",
        ]

    def clean_email(self):
        email = self.cleaned_data["email"]

        if User.objects.filter(email=email).exists():
            self.add_error(
                "email",
                ValidationError("Esse email já está em uso.", code="invalid"),
            )

        return email

    def clean_username(self):
        username = self.cleaned_data["username"]

        if User.objects.filter(username=username).exists():
            self.add_error(
                "username",
                ValidationError(
                    "Esse username já está em uso.",
                    code="invalid",
                ),
            )

        return username
