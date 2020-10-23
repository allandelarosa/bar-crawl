from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

from django.http import JsonResponse
import json

import math
import heapq

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
	location_data = json.loads(request.body)

	def distance(a, b):
		R = 6371  # Radius of the earth in km
		dLat = math.radians(a["lat"] - b["lat"])
		dLng = math.radians(a["lng"] - b["lng"])
		A = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(math.radians(a["lat"])) * math.cos(math.radians(b["lat"])) * math.sin(dLng/2) * math.sin(dLng/2)
		C = 2 * math.atan2(math.sqrt(A), math.sqrt(1-A))
		D = R * C # Distance in km
		return D

	class DSU:
		def __init__(self, names):
			self.par = {name:name for name in names}
		def find(self, x):
			if x != self.par[x]:
				self.par[x] = self.find(self.par[x])
			return self.par[x]
		def union(self, x, y):
			if x < y:
				self.par[self.find(y)] = self.find(x)
			else:
				self.par[self.find(x)] = self.find(y)

	dsu = DSU([loc["name"] for loc in location_data])

	edges = []
	for i, loc1 in enumerate(location_data):
		for loc2 in location_data[i + 1:]:
			heapq.heappush(
				edges,
				(distance(loc1, loc2), loc1, loc2)
			)

	seen = set()
	graph = []
	while edges:
		dist, loc1, loc2 = heapq.heappop(edges)
		if dsu.find(loc1["name"]) == dsu.find(loc2["name"]):
			continue
		dsu.union(loc1["name"], loc2["name"])

		graph.append([
			{"lat": loc1["lat"], "lng": loc1["lng"]},
			{"lat": loc2["lat"], "lng": loc2["lng"]}
			])

		seen.add(loc1["name"])
		seen.add(loc2["name"])

		pars = set(par for par in dsu.par.values())
		if len(pars) == 1:
			break
	
	return JsonResponse(graph, safe=False)
