from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name="t_index"),
    path('student', views.student, name="s_index"),
    path('guest', views.guest, name="g_index"),
]
