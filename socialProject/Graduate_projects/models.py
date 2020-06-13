from django.db import models

# Create your models here.
class project(models.Model):
    project_name = models.CharField(max_length=50,help_text="Please enter your project name")
    person_in_charge = models.CharField(max_length=50,help_text="Please enter your username")#專題負責人
    project_date = models.DateTimeField('最後修改日期',auto_now=True)
    #新增file upload
    
class Email(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False)
    body = models.TextField(max_length=5000, null=True, default=None, blank=True)
    subject = models.TextField(max_length=250, null=True, default=None, blank=True)

    class Meta:
        verbose_name = "Email"
        verbose_name_plural = "Emails"

    def __str__(self):
        return str(self.subject)