from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

from django.http import JsonResponse
import json

def hop(request):
	context = {
		'API_KEY': settings.API_KEY,
	}

	return render(request, 'navigate/hop.html', context)

def home(request):
	return render(request, 'navigate/home.html')

def test(request):
	received_json = json.loads(request.body)
	data = {'success': received_json['title'][::-1]}
	return JsonResponse(data)

def djikstra(request):
	location_data = json.loads(request.body)

	data = {'path': location_data}
	return JsonResponse(data)