from django.urls import path

from project.apps.user.views import (
    getUser,
    getUsers,
    getUserProfile,
    getUserQuestions,
    getUserMeQuestions,
    uploadFile,
    registerUser,
    updateUserProfile,
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
    path("profile/update/", updateUserProfile, name="update_profile"),
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
        "upload_file/",
        uploadFile,
        name="upload_file",
    ),
]
