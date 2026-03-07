from rest_framework import serializers

from apps.question.models import (
    Exam,
    ExamExtractionTask,
    Question,
    QuestionImage,
)


class ExamExtractionTaskSerializer(serializers.ModelSerializer):
    answer_key_file = serializers.FileField(required=False)

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


class QuestionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImage
        fields = ("id", "image", "filename", "mime_type")


class QuestionSerializer(serializers.ModelSerializer):
    images = QuestionImageSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = (
            "area",
            "topic",
            "question_id",
            "id",
            "name",
            "passage_text",
            "sources",
            "has_image",
            "stem",
            "options",
            "correct_answer",
            "images",
        )


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = (
            "id",
            "name_base",
            "name_sigle",
            "variant",
            "year",
            "style",
            "questions",
        )
