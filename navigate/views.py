from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

from django.http import JsonResponse

def hop(request):
	context = {
		'API_KEY': settings.API_KEY,
	}

	return render(request, 'navigate/hop.html', context)

def home(request):
	return render(request, 'navigate/home.html')

def test(request):
	data = {'success': 'potato'}
	return JsonResponse(data)