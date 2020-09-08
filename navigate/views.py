from django.shortcuts import render
from django.http import HttpResponse

def hop(request):
	return render(request, 'navigate/hop.html')

def home(request):
	return render(request, 'navigate/home.html')
