from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class PreProject(models.Model):
    project_name = models.CharField(max_length=50, null=False)
    advisor = models.CharField(max_length=50, null=False)
    year = models.CharField(max_length=10, null=False)
    group = models.IntegerField()
    content = models.CharField(max_length=300, null=False)
    members = models.CharField(max_length=40, null=False)

class Record(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.CharField(max_length=100)
    time = models.DateTimeField(default=datetime.now)
    group_id = models.IntegerField(default=0)
