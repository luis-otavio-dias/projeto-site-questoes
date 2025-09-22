from django.urls import path

from project.apps.user.views import (
    getUser,
    getUsers,
    getUserProfile,
    getUserQuestions,
    getUserMeQuestions,
    uploadFiles,
    registerUser,
    CustomTokenObtainPairView,
)

app_name = "user"

urlpatterns = [
    # API endpoints
    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="login",
    ),
    path("get_users/", getUsers, name="get_users"),
    path("register/", registerUser, name="register"),
    path("profile/", getUserProfile, name="profile"),
    path("<int:id>/", getUser, name="user"),
    path(
        "<int:id>/questions/",
        getUserQuestions,
        name="user_questions",
    ),
    path(
        "me/questions/",
        getUserMeQuestions,
        name="user_me_questions",
    ),
    path(
        "upload_questions/",
        uploadFiles,
        name="upload_questions",
    ),
]
