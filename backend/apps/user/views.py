from django.contrib.auth.hashers import make_password
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from apps.user.models import User
from apps.user.serializers import (
    FileUploadSerializer,
    LoginUserSerializer,
    RegisterUserSerializer,
    UserSerializer,
)


class RegisterUserView(CreateAPIView):
    serializer_class = RegisterUserSerializer


class UserInfoView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self) -> User:
        user = self.request.user
        return get_object_or_404(User, id=user.id)


class LoginView(APIView):
    authentication_classes = ()

    def post(self, request: HttpRequest) -> Response:
        serializer = LoginUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response(
                {
                    "user": UserSerializer(user).data,
                    "status": HTTP_200_OK,
                }
            )

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
            )

            return response
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request: HttpRequest) -> Response:
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                refresh.blacklist()

            except InvalidToken:
                msg = "Error invalidating token"
                return Response({"detail": msg}, status=HTTP_400_BAD_REQUEST)

        response = Response(
            {"detail": "Logout successful"}, status=HTTP_200_OK
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request: HttpRequest) -> Response:
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not provided"},
                status=HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)

        except InvalidToken:
            print()
            print("Error here")
            print()
            return Response(
                {"detail": "Invalid token"},
                status=HTTP_401_UNAUTHORIZED,
            )

        else:
            access_token = str(refresh.access_token)

            response = Response(
                {"message": "Token refreshed successfully"},
                status=HTTP_200_OK,
            )

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
            )

            return response


class UpdateUserInfoView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request: HttpRequest) -> Response:
        user = request.user
        serializer = UserSerializer(user)

        data = request.data

        user.email = data["email"]
        if data["password"] != "":
            user.password = make_password(data["password"])

        user.save()

        return Response(serializer.data)


class FileUploadView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FileUploadSerializer
