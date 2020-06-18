from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.core.mail import send_mail
from socialProject.settings import EMAIL_HOST_USER

def send_meeting():
    subject = "Meeting 時間約談"
    message = "Meeting通知"
    #recepient = User.objects.get("") 看目前是誰登入
    from_email = EMAIL_HOST_USER
    to_email = ['jeak831130015@gmail.com']#後面郵件可以用recepient@mail.nuk.edu.tw，一定要用[]，我也不知道不然會噴錯
    send_mail(subject,message,EMAIL_HOST_USER,to_email,fail_silently=False)

# Create your views here.
def login(request):
    return render(request, 'login.html')

def start(request):
    return render(request,'start.html')

#登入後才能跳到index.html
@login_required
def index(request):
    return render(request,'index.html')

@login_required
def mail(request):
    if request.method == "POST":
        send_meeting()
    return render(request,'sendmail.html')