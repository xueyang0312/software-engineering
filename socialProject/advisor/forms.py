from django import forms
from login.models import Profile
from .models import Record

class ProfileForm(forms.ModelForm):
    
    class Meta:
        model = Profile
        fields = ["userphone", "userline", "contactMail"]

class RecordForm(forms.ModelForm):

    class Meta:
        model = Record
        fields = ["username", "sentence", "group"]
        widgets = {
            "sentence": forms.Textarea(),
            "username": forms.HiddenInput(),
            "group": forms.HiddenInput()
        }
