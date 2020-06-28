from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from .models import PreProject, Record, FreeTime, MeetTime, MessageReply
from .forms import ProfileForm, RecordForm
from login.models import Profile
from Graduate_projects.models import project
import json
from datetime import datetime

# use to serialize PreProject object
def serializePreProject(self):
    data = {
        "project_name": self.project_name,
        "advisor" : self.advisor,
        "members" : self.members,
        "content" : self.content,
    }
    return data

# use to serialize project object
def serializeProject(self):
    data = {
        "projectname": self.project_name,
        "advisor": self.advisor,
        "members": self.members,
        "progress_value": self.Progress_rate,
    }
    return data

# use to serialize Profile object
def serializeProfile(self):
    data = {
        "userphone": self.userphone,
        "userline": self.userline,
        "contactMail": self.contactMail
    }
    return data

# 老師index頁面的view
def index(request):
    TIMEFORMAT = '%Y-%m-%d %H:%M'
    # 取得登入使用者之相關資訊
    u_id = request.session['_auth_user_id']
    idt = request.session['identity']
    user = User.objects.get(id=u_id)
    profile = Profile.objects.get(user_id=u_id)
    request.session['group_id'] = profile.group

    u_name = user.last_name + user.first_name
    u_mail = user.email
    u_phone = profile.userphone
    u_line = profile.userline

    form = ProfileForm(initial={'contactMail': u_mail})
    # 取得歷屆專題資料
    if request.is_ajax():
        # 透過年份，組別查找資料庫
        y = request.POST.get('year')
        g= request.POST.get('group')
        if request.POST.get('operation') == "fetch":
            pj = project.objects.get(group=request.POST.get("group_No"))
            return JsonResponse(serializeProject(pj))
        elif request.POST.get('operation') == 'pj':
            pj = PreProject.objects.filter(
                    year=y
                ).filter(
                    group=g
                ).first()
            return JsonResponse(serializePreProject(pj))

        # 回傳專題留言板內容
        elif request.POST.get('operation') == 'mes':
            mes = list(MessageReply.objects.filter(
                    year=y
                ).filter(
                    group=g
                )
            )
            messages = [{
                "username": m.username,
                "sentence": m.sentence,
                "time": m.time.strftime(TIMEFORMAT)
            } for m in mes]
            print(messages)
            return JsonResponse(json.dumps(messages), safe=False)
        
        # 回傳點選的使用者資料
        elif request.POST.get('operation') == 'getuser':
            name = request.POST.get('name')
            sel_user = User.objects.filter(
                first_name=name[1:]
            ).filter(
                last_name=name[0]
            ).first().id
            sel_profile = Profile.objects.get(user_id=sel_user)
            print(sel_profile)
            return JsonResponse(serializeProfile(sel_profile))
        
        # 儲存留言板訊息
        elif request.POST.get('operation') == 'sendmes':
            mes = MessageReply()
            mes.username = request.POST.get('username')
            mes.sentence = request.POST.get('sentence')
            mes.year = request.POST.get('year')
            mes.group = request.POST.get('group')
            mes.save()
            return HttpResponse("success")
    # user profile 更動表單
    elif request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            profile.userphone = form.cleaned_data['userphone']
            profile.userline = form.cleaned_data['userline']
            profile.contactMail = form.cleaned_data['contactMail']
            profile.save()
    request.session.set_expiry(0)
    return render(request, "advisor/t_index.html", locals())

# 老師行事曆頁面的view
def calendar(request):
    # 存有空的時間
    TIMEFORMAT = "%Y-%m-%d %H:%M" # 儲存Time的格式
    if request.is_ajax():
        # 依照組別，抓取資料庫中的meettime,freetime
        if request.POST.get('operation') == 'fetchTime':
            ftimes = list(FreeTime.objects.filter(group=request.session['group_id']).order_by('start'))
            mtimes = list(MeetTime.objects.filter(group=request.session['group_id']).order_by('start'))
            f = [{
                "title": "free time", 
                "start": time.start.strftime(TIMEFORMAT),
                "end": time.end.strftime(TIMEFORMAT),
                "color": "red",
                "allDay" : False
                } for time in ftimes]
            m = [{
                "title": "meet time", 
                "start": time.start.strftime(TIMEFORMAT),
                "end": time.end.strftime(TIMEFORMAT),
                "color": "orange",
                "allDay" : False
                } for time in mtimes]
            return JsonResponse(json.dumps(f+m), safe=False)
        # 老師勾選freetime, 存入資料庫
        else:
            s = request.POST.get('start')
            e = request.POST.get('end')
            group = request.POST.get('group')
            # construct FreeTime object
            ftime = FreeTime()
            ftime.start = datetime.strptime(s, TIMEFORMAT)
            ftime.end = datetime.strptime(e, TIMEFORMAT)
            ftime.group = group
            ftime.save()
    return render(request, "advisor/calendar.html")

# 老師聊天室頁面的view
def chat(request):
    ISOTIMEFORMAT = '%Y-%m-%d %H:%M' #儲存時間的格式，(西元年-月-日 時:分)
    # 取得使用者組別和之前聊天記錄
    u_id = request.session['_auth_user_id']
    user = User.objects.get(id=u_id)
    profile = Profile.objects.get(user_id=u_id)
    user_name = user.last_name + user.first_name
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
    return render(request, "advisor/chatroom.html", locals())