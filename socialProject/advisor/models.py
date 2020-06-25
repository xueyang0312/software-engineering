from django.db import models

# Create your models here.
class PreProject(models.Model):
    project_name = models.CharField(max_length=50, null=False)
    advisor = models.CharField(max_length=50, null=False)
    year = models.CharField(max_length=10, null=False)
    group = models.IntegerField()
    content = models.CharField(max_length=300, null=False)
    members = models.CharField(max_length=40, null=False)