from django import forms
from django.contrib.auth.models import User

class SendEmailForm(forms.Form):
    CHOICES = User.objects.all()
    _selected_action = forms.CharField(widget=forms.MultipleHiddenInput)
    recipients = forms.ModelMultipleChoiceField(widget=forms.CheckboxSelectMultiple, queryset=CHOICES)