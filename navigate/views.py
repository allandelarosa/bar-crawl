from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

def hop(request):
	return render(request, 'navigate/hop.html', {'API_KEY': settings.API_KEY})

def home(request):
	return render(request, 'navigate/home.html')
