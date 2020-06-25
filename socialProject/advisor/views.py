from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "t_index.html")

def student(request):
    return HttpResponse("you're in student index page")

def guest(request):
    return HttpResponse("you're in guest index page")