from typing import ClassVar

from django.contrib.auth import authenticate
from django.core.files.uploadedfile import UploadedFile
from rest_framework import serializers

from apps.user.models import File, User
from apps.user.validators import validate_file_type


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password")
        extra_kwargs: ClassVar[dict[str, dict]] = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            is_staff=False,
        )


class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> User:
        user = authenticate(**attrs)

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
        return File.objects.create(user=user, **validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email")
