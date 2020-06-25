from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name="t_index"),
    path('ajax', views.redirect),
    path('calendar', views.calendar, name="calendar"),
    path('judge', views.judge, name="judge"),
]
