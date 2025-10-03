# from pathlib import Path
# from utils.add_questions import add_question_csv

# API Views
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from rest_framework_simplejwt.views import TokenObtainPairView

from project.apps.user.models import User, File
from project.apps.question.serializers import QuestionSerializer
from project.apps.user.serializers import (
    FileSerializer,
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
            # email=data["email"],
            password=make_password(data["password"]),
        )

        serializer = UserTokenSerializer(instance=user, many=False)

        return Response(serializer.data)

    except IntegrityError:
        message = {
            "detail": "User with this username or email already exists.",
        }
        return Response(message, status=HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def uploadFiles(request):
    try:
        data = request.data.get("file")
        user = request.user
        file = File.objects.create(
            user=user,
            file=data,
        )
        serializer = FileSerializer(file, many=False)
        return Response(serializer.data)

    except IntegrityError:
        message = {
            "deetail": "Error uploading file.",
        }
        return Response(message, status=HTTP_400_BAD_REQUEST)


# Template Views
# @login_required(login_url="user:login")
# def add_questions(request):
#     form = AddQuestionsForm()
#     user = User.objects.get(id=request.user.id)

#     if request.method == "POST":
#         form = AddQuestionsForm(request.POST, request.FILES)

#         if form.is_valid():
#             file = form.save(commit=False)
#             file.user = user
#             file.save()
#             file_path = (
#                 Path(__file__).parent.parent.parent.parent
#                 / "media"
#                 / str(
#                     file.file,
#                 )
#             )
#             add_question_csv(file_path, user)

#             return redirect("question:index")

#     return render(request, "add_questions.html", {"form": form})
