from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.serializers import serialize
from django.http import JsonResponse
from advisor.models import PreProject, Record
from advisor.forms import ProfileForm, RecordForm
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
    # 更新使用者資料
    elif request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            profile.userphone = form.cleaned_data['userphone']
            profile.userline = form.cleaned_data['userline']
            profile.contactMail = form.cleaned_data['contactMail']
            profile.save()
    return render(request, "student/s_index.html", locals())

def calendar(request):
    
    return render(request, "student/calendar.html")

def chat(request):
    ISOTIMEFORMAT = '%Y-%m-%d %H:%M' #儲存時間的格式，(西元年-月-日 時:分)
    # 取得使用者組別和之前聊天記錄
    u_id = request.session['_auth_user_id']
    user = User.objects.get(id=u_id)
    profile = Profile.objects.get(user_id=u_id)
    user_name = user.username
    group = profile.group
    form = RecordForm(initial={'username': user_name, 'group': group})
    messages = list(Record.objects.all().order_by('time'))
    
    if request.is_ajax(): #更新聊天室
        records = list(Record.objects.filter(group=group).order_by('time'))
        # 將所有訊息存成一個list
        messages = [{
            "username": record.username,
            "sentence": record.sentence,
            "time": record.time.strftime(ISOTIMEFORMAT)
        } for record in records]
        return JsonResponse(json.dumps(messages), safe=False)
        
    elif request.method == "POST": #使用者送出訊息
        form = RecordForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            form.save()
            messages = list(Record.objects.all().order_by('time'))
    return render(request, "student/chatroom.html", locals())