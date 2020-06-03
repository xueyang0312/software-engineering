from django.shortcuts import render

# Create your views here.
def login(request):
    return render(request, 'login.html')

def start(request):
    return render(request,'start.html')