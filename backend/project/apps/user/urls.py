from django.urls import path
from project.apps.user import views
from project.apps.user.api.views import (
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
    path("user/register/", views.register, name="register"),
    path("user/login/", views.login_view, name="login"),
    path("user/logout/", views.logout_view, name="logout"),
    path("user/add_questions/", views.add_questions, name="add_questions"),
    # API endpoints
    path(
        "api/users/login",
        CustomTokenObtainPairView.as_view(),
        name="login",
    ),
    path("api/users/", getUsers, name="users"),
    path("api/users/register/", registerUser, name="register"),
    path("api/users/profile/", getUserProfile, name="profile"),
    path("api/users/<int:id>/", getUser, name="user"),
    path(
        "api/users/<int:id>/questions/",
        getUserQuestions,
        name="user_questions",
    ),
    path(
        "api/users/me/questions/",
        getUserMeQuestions,
        name="user_me_questions",
    ),
    path(
        "api/users/upload_questions/",
        uploadFiles,
        name="upload_questions",
    ),
]
