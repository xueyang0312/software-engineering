from django.contrib import admin
from .models import project
# Register your models here.

class projectAdmin(admin.ModelAdmin):
    list_display = ('project_name','person_in_charge','project_date')

admin.site.register(project,projectAdmin)