from django.shortcuts import render
from django.contrib.auth.models import User
from django.core.serializers import serialize
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from socialProject.settings import EMAIL_HOST_USER
from advisor.models import PreProject, Record, FreeTime, MeetTime, MessageReply
from advisor.forms import ProfileForm, RecordForm
from login.models import Profile
from django.core.files.storage import FileSystemStorage
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
        "pj_text_motive": self.text_motive,
        "pj_text_system": self.text_SystemRequirement,
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
# 學生index頁面的view
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
    form = ProfileForm(initial={'contactMail': u_mail, 'userphone': u_phone, 'userline': u_line})
    # 取得歷屆和應屆專題資料
    if request.is_ajax():
        y = request.POST.get('year')
        g= request.POST.get('group')
        # 應屆專題資料
        if request.POST.get('operation') == "fetch":
            pj = project.objects.get(group=request.POST.get("group_No"))
            return JsonResponse(serializeProject(pj))
        # 透過年份，組別查找資料庫
        elif request.POST.get('operation') == 'pj':
            pj = PreProject.objects.filter(
                    year=y
                ).filter(
                    group=g
                ).first()
            return JsonResponse(serializePreProject(pj))
        #儲存專題內文
        if request.POST.get('operation') == 'storepj':
            print(request.POST.get('operation'))
            user_group = request.POST.get('pj_groupNo')
            pj = project.objects.get(group=user_group)
            pj.project_name = request.POST.get('pj_name')
            pj.Progress_rate = request.POST.get('pj_Progress_rate')
            pj.text_motive = request.POST.get('pj_text_motive')
            pj.text_SystemRequirement = request.POST.get('pj_text_system')
            pj.private_pj_name = request.POST.get('private_pj_name')
            pj.private_text_motive = request.POST.get('private_text_motive')
            pj.private_text_system = request.POST.get('private_text_system')
            pj.save()
            return JsonResponse(request.POST)
            return render(request, "student/s_index.html", locals())
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
        elif request.POST.get('operation') == 'mes':
            name = request.POST.get('name')
            sel_user = User.objects.filter(
                first_name=name[1:]
            ).filter(
                last_name=name[0]
            ).first().id
            sel_profile = Profile.objects.get(user_id=sel_user)
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
    # 更新使用者資料

    elif request.method == "POST" and request.FILES.get('file'):
        myfile = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        uploaded_file = uploaded_file_url.split('/')
        time = str(datetime.now()).split('.')
        print(time[0])
        return render(request, 'student/s_index.html', {
        'uploaded_file_url': uploaded_file_url,
        'uploaded_file': uploaded_file[2],
        'uploaded_time': time[0]
        })
    elif request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            profile.userphone = form.cleaned_data['userphone']
            profile.userline = form.cleaned_data['userline']
            profile.contactMail = form.cleaned_data['contactMail']
            profile.save()
    request.session.set_expiry(0)
    return render(request, "student/s_index.html", locals())

# 學生行事曆頁面的view
def calendar(request):
    TIMEFORMAT = '%Y-%m-%d %H:%M' # free time 格式
    if request.is_ajax():
        # 依照組別，抓取資料庫中的meettime,freetime
        if request.POST.get('operation') == "fetchTime":
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
        # 學生約meeting,建立MeetTime，並刪除對應之FreeTime，並寄提醒信件
        elif request.POST.get('operation') == 'meeting':
            time_dict = {k: "".join(v) for k, v in request.POST.items()}
            # construct MeetTime object
            mtime = MeetTime()
            mtime.start = datetime.strptime(request.POST.get('start'), TIMEFORMAT)
            mtime.end = datetime.strptime(request.POST.get('end'), TIMEFORMAT)
            mtime.group = request.session['group_id']
            mtime.save()

            # delete corresponding FreeTime objects
            FreeTime.objects.filter(
                group=request.session['group_id']
            ).filter(
                start=datetime.strptime(request.POST.get('start'), TIMEFORMAT)
            ).delete()

            # return meetime object 
            time_dict["title"] = "Meet Time"
            time_dict["color"] = "orange"
            time_dict["allDay"] = False

            # send notification letter
            subject = "Meeting 時間約談"
            message = "Meeting 時間通知: \n開始時間: " + datetime.strptime(request.POST.get('start'), TIMEFORMAT)
            recepients = list(Profile.objects.filter(group=request.session['group_id'])) # 寄給整組的人
            from_email = EMAIL_HOST_USER
            to_email = [u.contactMail for u in recepients] # 後面郵件可以用recepient@mail.nuk.edu.tw，一定要用[]，我也不知道不然會噴錯
            send_mail(subject,message,EMAIL_HOST_USER,to_email,fail_silently=False)

            return JsonResponse(time_dict)
    return render(request, "student/calendar.html")

# 學生聊天室頁面的view
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
    return render(request, "student/chatroom.html", locals())