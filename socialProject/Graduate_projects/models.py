from django.db import models

# Create your models here.
class project(models.Model):
    project_name = models.CharField(max_length=50,help_text="Please enter your project name")
    person_in_charge = models.CharField(max_length=50,help_text="Please enter your username") #專題負責人
    advisor = models.CharField(max_length = 50,help_text="Please enter your instructor",default = "teacher") #指導教授
    project_date = models.DateTimeField('最後修改日期',auto_now=True)
    #確認專題檔案是否上傳，預設值為false
    upload = models.BooleanField(default=False)
    #新增file upload
    group = models.IntegerField(default=0)
    members = models.CharField(max_length=40, default=None, null=False)
    Progress_rate = models.IntegerField(default = 0,help_text="Please enter your progress rate") #專題進度
    text_motive = models.CharField(max_length=1000,default="text",help_text="Please enter your group members username")
    text_SystemRequirement = models.CharField(max_length=1000,default="text",help_text="Please enter your group system request")
    private_pj_name = models.BooleanField(default=False)
    private_text_motive = models.BooleanField(default=False)
    private_text_system = models.BooleanField(default=False)
    
class Email(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False)
    body = models.TextField(max_length=5000, null=True, default=None, blank=True)
    subject = models.TextField(max_length=250, null=True, default=None, blank=True)

    class Meta:
        verbose_name = "Email"
        verbose_name_plural = "Emails"

    def __str__(self):
        return str(self.subject)