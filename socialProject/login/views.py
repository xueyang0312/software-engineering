from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse
from django.core.mail import send_mail
from socialProject.settings import EMAIL_HOST_USER
from .models import Profile

def send_meeting():
    subject = "Meeting 時間約談"
    message = "Meeting通知"
    #recepient = User.objects.get("") 看目前是誰登入
    from_email = EMAIL_HOST_USER
    to_email = ['jeak831130015@gmail.com']#後面郵件可以用recepient@mail.nuk.edu.tw，一定要用[]，我也不知道不然會噴錯
    send_mail(subject,message,EMAIL_HOST_USER,to_email,fail_silently=False)

def callback(request):
    print("in callback")
    print(request.session)
    if request.user.is_authenticated:
        print(request.user.email)
    return HttpResponse("in callback url")

# Create your views here.
def login(request, identity):
    # callback 為重新導向網址
    if identity == "callback":
        idt = request.session['identity']
        u_id = request.session['_auth_user_id']
        Profile.objects.create(user=User.objects.get(id=u_id), identity=idt)
    identity = identity
    request.session['identity'] = identity
    return render(request, 'login.html', {'identity':identity})

def start(request):
    identity = "身份"
    return render(request,'start.html', {'identity':identity})

#登入後才能跳到index.html
@login_required
def index(request):
    return render(request,'index.html')

@login_required
def mail(request):
    if request.method == "POST":
        send_meeting()
    return render(request,'sendmail.html')