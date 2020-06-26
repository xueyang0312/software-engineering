from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from .models import PreProject
from .forms import ProfileForm
from login.models import Profile
import json

# use to serialize PreProject object
def serializePreProject(self):
    data = {
        "project_name": self.project_name,
        "advisor" : self.advisor,
        "members" : self.members,
        "content" : self.content,
    }
    return data

# Create your views here.
def index(request):
    # 取得登入使用者之相關資訊
    u_id = request.session['_auth_user_id']
    idt = request.session['identity']
    user = User.objects.get(id=u_id)
    profile = Profile.objects.get(user_id=u_id)

    u_name = user.username
    u_mail = user.email
    u_phone = profile.userphone
    u_line = profile.userline

    form = ProfileForm(initial={'contactMail': u_mail})
    # 取得歷屆專題資料
    if request.is_ajax():
        # 透過年份，組別查找資料庫
        print(request.POST.get('year'), request.POST.get('group'))
        pj = PreProject.objects.filter(
                year=request.POST.get('year')
            ).filter(
                group=request.POST.get('group')
            ).first()
        return JsonResponse(serializePreProject(pj))

    elif request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            profile.userphone = form.cleaned_data['userphone']
            profile.userline = form.cleaned_data['userline']
            profile.contactMail = form.cleaned_data['contactMail']
            profile.save()
    return render(request, "t_index.html", locals())

def redirect(request):
    if request.is_ajax():
        return HttpResponseRedirect(reverse('calendar'))
    return HttpResponse("ya")

def calendar(request):
    
    return render(request, "calendar.html")

def judge(request):
    pass