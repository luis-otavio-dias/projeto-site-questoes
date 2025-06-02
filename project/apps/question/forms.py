from django import forms


class CustomRadioSelect(forms.RadioSelect):
    def create_option(
        self, name, value, label, selected, index, subindex=None, attrs=None
    ):
        option = super().create_option(
            name, value, label, selected, index, subindex, attrs
        )

        option["label"] = f"{value}) {label}"
        return option


class AnswerForm(forms.Form):
    reply = forms.ChoiceField(choices=[], widget=CustomRadioSelect)

    def __init__(self, answer_options, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["reply"].choices = [
            (ans.option, ans.option_text) for ans in answer_options
        ]
