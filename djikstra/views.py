from django.shortcuts import render

from django.http import JsonResponse
import json

import heapq
from math import (
	sin, cos, atan2, acos, radians, 
	degrees, sqrt
)

from collections import defaultdict

def path(request):
    json_data = json.loads(request.body)
    location_data = json_data['location_data']
    start_point = json_data['start_point']
    end_point = json_data['end_point']

    data = {'path': location_data}
    return JsonResponse(data)


def graph(request):
    location_data = json.loads(request.body)

    coords = {loc["name"]: {"lat": loc["lat"], "lng": loc["lng"]}
              for loc in location_data}

    def distance(a, b):
        R = 6371  # Radius of the earth in km
        dLat = radians(a["lat"] - b["lat"])
        dLng = radians(a["lng"] - b["lng"])
        A = sin(dLat/2) * sin(dLat/2) + \
            cos(radians(a["lat"])) * cos(radians(b["lat"])) * \
            sin(dLng/2) * sin(dLng/2)
        C = 2 * atan2(sqrt(A), sqrt(1-A))
        D = R * C  # Distance in km
        return D + 0.0001  # add small distance to avoid division by 0

    def find_angle(a, b, c):
        return degrees(acos((a**2 + b**2 - c**2) / (2 * a * b)))

    edges = []
    distances = defaultdict(dict)

    for i, loc1 in enumerate(location_data):
        for loc2 in location_data[i + 1:]:
            dist = distance(loc1, loc2)

            edges.append((dist, loc1["name"], loc2["name"]))

            distances[loc1["name"]][loc2["name"]] = dist
            distances[loc2["name"]][loc1["name"]] = dist

    heapq.heapify(edges)

    # to display only
    to_display = []
    graph = defaultdict(dict)

    THRESHOLD = 75

    while edges:
        dist, loc1, loc2 = heapq.heappop(edges)

        not_needed = False
        for loc3 in graph[loc1]:
            angle = find_angle(dist, graph[loc1][loc3], distances[loc2][loc3])

            if angle > THRESHOLD * (1 - graph[loc1][loc3]/dist):
                continue
            not_needed = True
            break

        if not_needed:
            continue

        for loc3 in graph[loc2]:
            angle = find_angle(dist, graph[loc2][loc3], distances[loc1][loc3])

            if angle > THRESHOLD * (1 - graph[loc2][loc3]/dist):
                continue
            not_needed = True
            break

        if not_needed:
            continue

        to_display.append([coords[loc1], coords[loc2]])

        graph[loc1][loc2] = dist
        graph[loc2][loc1] = dist

    return JsonResponse(to_display, safe=False)
