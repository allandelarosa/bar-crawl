from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

from django.http import JsonResponse
import json

import math


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
    json_data = json.loads(request.body)
    location_data = json_data['location_data']
    start_point = json_data['start_point']
    end_point = json_data['end_point']

    data = {'path': location_data}
    return JsonResponse(data)


def construct_graph(request):
	# def distance(a, b):
	# 	R = 6371  # Radius of the earth in km
	# 	dLat = math.radians(a.lat - b.lat)
	# 	dLng = math.radians(a.lng - b.lng)
	# 	A = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(math.radians(a.lat)) * math.cos(math.radians(b.lat)) * math.sin(dLng/2) * math.sin(dLng/2)
	# 	C = 2 * math.atan2(math.sqrt(A), math.sqrt(1-A))
	# 	D = R * C # Distance in km
	# 	return D

	location_data = json.loads(request.body)
	graph = []
	for i, loc1 in enumerate(location_data):
		for loc2 in location_data[i + 1:]:
			graph.append([
				{"lat":loc1["lat"], "lng":loc1["lng"]},
				{"lat":loc2["lat"], "lng":loc2["lng"]}
				])
	return JsonResponse(graph, safe=False)
