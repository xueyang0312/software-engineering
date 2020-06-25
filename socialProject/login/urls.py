from django.urls import path, include
from . import views

urlpatterns = [
    path('<str:identity>', views.login, name="login"),
]