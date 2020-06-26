from django.db import models
from django.contrib.auth.models import User, UserManager
from django.dispatch import receiver
from django.db.models.signals import post_save
# addtional profile about users 
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    identity = models.CharField(max_length=20, blank=True)
    usergrade = models.IntegerField(blank=True, null=True)
    userphone = models.CharField(max_length=20, blank=True)
    userline = models.CharField(max_length=20, blank=True)
    contactMail = models.EmailField(max_length=254, blank=True)
    objects = UserManager()

@receiver(post_save, sender=User)
def _create_user_profile(sender,instance, created, **kwargs):
    if created:
        print("{} profile created".format(instance.username))
        Profile.objects.created(user=instance, contactMail=instance.email)
    
@receiver(post_save, sender=User)
def _save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
        
    