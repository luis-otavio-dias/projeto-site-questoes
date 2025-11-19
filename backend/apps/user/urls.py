from django.urls import path

from apps.user.views import (
    CookieTokenRefreshView,
    FileUploadView,
    LoginView,
    LogoutView,
    RegisterUserView,
    UpdateUserInfoView,
    UserInfoView,
)

app_name = "user"

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("me/profile/", UserInfoView.as_view(), name="profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="token-refresh"),
    path(
        "me/profile/update/",
        UpdateUserInfoView.as_view(),
        name="update_profile",
    ),
    path(
        "upload_file/",
        FileUploadView.as_view(),
        name="upload_file",
    ),
    # path("get_users/", getUsers, name="get_users"),
    # path("<int:id>/", getUser, name="user"),
    # path(
    #     "<int:id>/questions/",
    #     getUserQuestions,
    #     name="user_questions",
    # ),
    # path(
    #     "me/questions/",
    #     getUserMeQuestions,
    #     name="user_me_questions",
    # ),
]
