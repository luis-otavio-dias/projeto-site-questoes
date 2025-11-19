from rest_framework import serializers

from apps.question.models import Answer, Edition, Question, Theme

# from apps.user.serializers import UserSerializer


class EditionSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Edition
        fields = ("year",)


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ("name",)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ("option", "option_text")


class QuestionSerializer(serializers.ModelSerializer):
    edition = EditionSerilizer(read_only=True)

    theme = ThemeSerializer(read_only=True)

    answer_options = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = (
            "id",
            "edition",
            "theme",
            "correct_answer",
            "stem",
            "answer_options",
        )
