from rest_framework import serializers

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from project.apps.user.models import User, File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "file"]


class UserSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "isAdmin", "files"]

    isAdmin = serializers.SerializerMethodField(read_only=True)

    def get_isAdmin(self, obj):
        return obj.is_staff


class UserTokenSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "isAdmin", "files", "token"]

    token = serializers.SerializerMethodField(read_only=True)

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserTokenSerializer(instance=self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data
