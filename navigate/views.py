from django.shortcuts import render
from django.http import HttpResponse

from django.conf import settings

from django.http import JsonResponse
import json

import math
import heapq

from collections import defaultdict

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
		return D + 0.001

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
			print(distance(loc1, loc2))
			heapq.heappush(
				edges,
				(distance(loc1, loc2), loc1, loc2)
			)

	seen = set()
	graph = []
	rejected = []

	min_edges = {}
	# used_edges = defaultdict(list)

	while edges:
		dist, loc1, loc2 = heapq.heappop(edges)
		if dsu.find(loc1["name"]) == dsu.find(loc2["name"]):
			rejected.append((dist, loc1, loc2))
			continue
		dsu.union(loc1["name"], loc2["name"])

		graph.append([
			{"lat": loc1["lat"], "lng": loc1["lng"]},
			{"lat": loc2["lat"], "lng": loc2["lng"]}
			])

		seen.add(loc1["name"])
		seen.add(loc2["name"])

		if loc1["name"] not in min_edges:
			min_edges[loc1["name"]] = dist
		else:
			min_edges[loc1["name"]] = min(dist, min_edges[loc1["name"]])

		if loc2["name"] not in min_edges:
			min_edges[loc2["name"]] = dist
		else:
			min_edges[loc2["name"]] = min(dist, min_edges[loc2["name"]])

		# used_edges[loc1["name"]].append(dist)
		# used_edges[loc2["name"]].append(dist)

		pars = set(par for par in dsu.par.values())
		if len(pars) == 1:
			break

	# def median(x):
	# 	return x[len(x)//2]

	WEIGHT = 1.5

	for dist, loc1, loc2 in rejected:
		# if dist <= WEIGHT * (min_edges[loc1["name"]] + min_edges[loc2["name"]]) / 2:
		if dist <= WEIGHT * min_edges[loc1["name"]] or dist <= WEIGHT * min_edges[loc2["name"]]:
		# if dist <= WEIGHT * min(median(used_edges[loc1["name"]]), median(used_edges[loc2["name"]])):
			graph.append([
				{"lat": loc1["lat"], "lng": loc1["lng"]},
				{"lat": loc2["lat"], "lng": loc2["lng"]}
				])
			# heapq.heappush(used_edges[loc1["name"]], dist)
			# heapq.heappush(used_edges[loc2["name"]], dist)
	
	return JsonResponse(graph, safe=False)
