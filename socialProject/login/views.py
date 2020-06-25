from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.core.mail import send_mail
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from socialProject.settings import EMAIL_HOST_USER
from .models import Profile

def send_meeting():
    subject = "Meeting 時間約談"
    message = "Meeting通知"
    #recepient = User.objects.get("") 看目前是誰登入
    from_email = EMAIL_HOST_USER
    to_email = ['jeak831130015@gmail.com']#後面郵件可以用recepient@mail.nuk.edu.tw，一定要用[]，我也不知道不然會噴錯
    send_mail(subject,message,EMAIL_HOST_USER,to_email,fail_silently=False)

# Create your views here.
def login(request, identity):
    # callback 為重新導向網址
    if identity == "callback":
        print("in callback")
        idt = request.session['identity']
        print(idt)
        u_id = request.session['_auth_user_id']
        # 若沒有Profile指向u_id，則建立一個Profile
        try:
            p = Profile.objects.filter(user_id=u_id)
            if identity != p[0].identity:
                p.update(identity=idt)
        except ObjectDoesNotExist:
            Profile.objects.create(user=User.objects.get(id=u_id), identity=idt)
        if idt == "student": # 轉到學生頁面
            return HttpResponseRedirect(reverse('s_index'))
        elif idt == "teacher": # 轉到老師頁面
            print("Is teacher")
            return HttpResponseRedirect(reverse('t_index'))
        else: # 轉到訪客頁面
            return HttpResponseRedirect(reverse('g_index'))
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