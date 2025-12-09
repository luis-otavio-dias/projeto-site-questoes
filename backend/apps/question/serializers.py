from rest_framework import serializers

from apps.question.models import (
    Answer,
    Edition,
    Exam,
    ExamExtractionTask,
    Question,
    Theme,
)


class ExamExtractionTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamExtractionTask
        fields = (
            "id",
            "status",
            "exam_file",
            "answer_key_file",
            "title",
            "description",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")

    def create(self, validated_data: dict) -> ExamExtractionTask:
        return super().create(validated_data)


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
            "stem",
            "answer_options",
            "correct_answer",
        )


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ("id", "title", "description", "questions")
