from typing import ClassVar

from django.contrib.auth import authenticate
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers

from apps.question.serializers import QuestionSerializer
from apps.user.models import File, User
from apps.user.validators import validate_file_type
from utils.add_questions import add_question_csv


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password")
        extra_kwargs: ClassVar[dict[str, dict]] = {
            "password": {"write_only": True}
        }

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            is_staff=False,
        )


class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict) -> User:
        user = authenticate(**data)

        if user and user.is_active:
            return user

        msg = "Invalid credentials"
        raise serializers.ValidationError(msg)


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "title", "file_type", "file_upload")


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "title", "file_type", "file_upload")
        read_only_fields = ("id", "user")

    def validate_file_upload(self, value: UploadedFile) -> UploadedFile:
        validate_file_type(value)
        return value

    def create(self, validated_data: dict) -> File:
        user = self.context["request"].user
        file_instance = File.objects.create(user=user, **validated_data)
        add_question_csv(file_instance.file_upload.path, user)
        return file_instance


class UserSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "files", "questions")
