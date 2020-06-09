from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import Http404

# Create your views here.
def login(request):
    return render(request, 'login.html')

def start(request):
    return render(request,'start.html')

#登入後才能跳到index.html
@login_required
def index(request):
    return render(request,'index.html')