from __future__ import annotations

from typing import TYPE_CHECKING, Any

from drf_spectacular.extensions import OpenApiAuthenticationExtension
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

if TYPE_CHECKING:
    from django.http import HttpRequest
    from drf_spectacular.openapi import AutoSchema
    from rest_framework_simplejwt.tokens import Token

    from apps.user.models import User


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: HttpRequest) -> tuple[User, Token] | None:
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
        except AuthenticationFailed as e:
            msg = "Invalid authentication token"
            raise AuthenticationFailed(msg) from e

        try:
            user = self.get_user(validated_token)
        except AuthenticationFailed as e:
            msg = "User not found"
            raise AuthenticationFailed(msg) from e
        else:
            return user, validated_token


class CookieJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = "apps.user.authentication.CookieJWTAuthentication"
    name = "Cookie JWT Authentication"

    def get_security_definition(
        self, auto_schema: AutoSchema
    ) -> dict[str, Any]:
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": "access_token",
        }
