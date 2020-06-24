"""socialProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from login import views

# 各個subsystem中的url都在各自的urls.py，這裡只負責include
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.start,name="start"),
    path('login/', include('login.urls')),
    path('advisor/', include('advisor.urls')),
    #path('index/', views.index,name="index"),#測試用之後註解拿掉
    path('mail/',  views.mail,name="mail"),
    path('accounts/', include('allauth.urls')),
]
