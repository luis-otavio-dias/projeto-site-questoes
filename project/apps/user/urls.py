from django.urls import path
from project.apps.user import views

app_name = "user"

urlpatterns = [
    path("user/register/", views.register, name="register"),
    path("user/login/", views.login_view, name="login"),
    path("user/logout/", views.logout_view, name="logout"),
]
