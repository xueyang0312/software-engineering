from django.db import models

# Create your models here.
class project(models.Model):
    project_name = models.CharField(max_length=50,help_text="Please enter your project name")
    person_in_charge = models.CharField(max_length=50,help_text="Please enter your username")#專題負責人
    project_date = models.DateTimeField('最後修改日期',auto_now=True)