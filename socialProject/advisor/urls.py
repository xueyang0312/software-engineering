from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name="t_index"),
    path('calendar', views.calendar, name="calendar"),
    path('chat', views.chat, name="chat"),
]
