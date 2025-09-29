from rest_framework import serializers
from project.apps.question.models import Question, Edition, Theme, Answer

from project.apps.user.serializers import UserSerializer


class EditionSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Edition
        fields = ["id", "year"]


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "user",
            "id",
            "edition",
            "theme",
            "correct_answer",
            "stem",
            "answer_options",
        ]

    edition = EditionSerilizer()

    theme = ThemeSerializer()

    user = UserSerializer()

    answer_options = serializers.SerializerMethodField()

    def get_answer_options(self, obj):
        from .serializers import AnswerSerializer

        return AnswerSerializer(obj.answer_options.all(), many=True).data


class AnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(),
        many=False,
    )

    class Meta:
        model = Answer
        fields = ["id", "question", "option", "option_text"]
