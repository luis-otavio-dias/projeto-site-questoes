from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class RegisterForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["first_name"].widget.attrs.update(
            {
                "placeholder": "Primeiro nome",
            },
        )
        self.fields["email"].widget.attrs.update(
            {"placeholder": "E-mail"},
        )
        self.fields["username"].widget.attrs.update(
            {"placeholder": "Username"},
        )
        # self.fields["username"].widget.get_context({"help_text": "new"})
        self.fields["password1"].widget.attrs.update(
            {"placeholder": "Senha"},
        )
        self.fields["password2"].widget.attrs.update(
            {"placeholder": "Confirmar senha"},
        )

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
