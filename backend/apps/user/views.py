from typing import cast

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from apps.user.models import User
from apps.user.serializers import (
    FileUploadSerializer,
    LoginUserSerializer,
    RegisterUserSerializer,
    UpdateUserSerializer,
    UserSerializer,
)


class RegisterUserView(CreateAPIView):
    serializer_class = RegisterUserSerializer


class UserInfoView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self) -> User:
        user = self.request.user
        return get_object_or_404(User, id=user.pk)


class LoginView(APIView):
    authentication_classes = ()

    @extend_schema(request=LoginUserSerializer, responses=UserSerializer)
    def post(self, request: Request) -> Response:
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

    @extend_schema(
        responses={
            "200": "Logout successful",
            "400": "Error invalidating token",
            "401": "Refresh token not provided or invalid",
        },
    )
    def post(self, request: Request) -> Response:
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                token = cast("Token", refresh_token)
                refresh = RefreshToken(token)
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
    def post(self, request: Request) -> Response:
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not provided"},
                status=HTTP_401_UNAUTHORIZED,
            )

        try:
            token = cast("Token", refresh_token)
            refresh = RefreshToken(token)

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

    @extend_schema(request=UserSerializer, responses=UserSerializer)
    def put(self, request: Request) -> Response:
        serializer = UpdateUserSerializer(request.user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class FileUploadView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FileUploadSerializer
