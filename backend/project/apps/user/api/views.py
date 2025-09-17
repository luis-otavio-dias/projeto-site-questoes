from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from rest_framework_simplejwt.views import TokenObtainPairView

from project.apps.user.models import User
from project.apps.question.api.serializers import QuestionSerializer
from project.apps.user.api.serializers import (
    UserSerializer,
    UserTokenSerializer,
    CustomTokenObtainPairSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUser(request, id):
    user = get_object_or_404(User, id=id)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(instance=user, many=False)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUserQuestions(request, id):
    user = get_object_or_404(User, id=id)
    questions = user.question.all()
    serializaer = QuestionSerializer(questions, many=True)
    return Response(serializaer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserMeQuestions(request):
    user = request.user
    questions = user.question.all()
    serializaer = QuestionSerializer(questions, many=True)
    return Response(serializaer.data)


@api_view(["POST"])
def registerUser(request):
    try:
        data = request.data

        user = User.objects.create(
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),
        )

        serializer = UserTokenSerializer(instance=user, many=False)

        return Response(serializer.data)

    except IntegrityError:
        message = {
            "descrição": "Já existe um usuário com esse username ou email.",
        }
        return Response(message, status=HTTP_400_BAD_REQUEST)
