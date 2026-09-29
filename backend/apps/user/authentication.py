from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

from drf_spectacular.extensions import OpenApiAuthenticationExtension
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

if TYPE_CHECKING:
    from drf_spectacular.openapi import AutoSchema
    from rest_framework.request import Request
    from rest_framework_simplejwt.tokens import Token

    from apps.user.models import User


class CookieJWTAuthentication(BaseAuthentication):
    def __init__(self) -> None:
        self.jwt_auth = JWTAuthentication()

    def authenticate(self, request: Request) -> tuple[User, Token] | None:
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        try:
            validated_token = self.jwt_auth.get_validated_token(
                bytes(token, "utf-8")
            )
        except AuthenticationFailed as e:
            msg = "Invalid authentication token"
            raise AuthenticationFailed(msg) from e

        try:
            user = self.jwt_auth.get_user(validated_token)
        except AuthenticationFailed as e:
            msg = "User not found"
            raise AuthenticationFailed(msg) from e
        else:
            return cast("User", user), validated_token


class CookieJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = "apps.user.authentication.CookieJWTAuthentication"
    name = "Cookie JWT Authentication"

    def get_security_definition(
        self,
        auto_schema: AutoSchema,
    ) -> dict[str, Any]:
        _ = auto_schema
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": "access_token",
        }
