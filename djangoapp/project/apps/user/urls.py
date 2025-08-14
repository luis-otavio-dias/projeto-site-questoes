from django.urls import path
from project.apps.user import views
from project.apps.user.api.views import getUser

app_name = "user"

urlpatterns = [
    path("user/register/", views.register, name="register"),
    path("user/login/", views.login_view, name="login"),
    path("user/logout/", views.logout_view, name="logout"),
    path("user/add_questions/", views.add_questions, name="add_questions"),
    path("user/get_user/<int:id>/", getUser, name="get_user"),
]
