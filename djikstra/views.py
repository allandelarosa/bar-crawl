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

    inf = float("inf")

    graph = json_data['graph']
    start = json_data['start_point']['id']
    stop = json_data['end_point']['id']
    location_data = json_data['location_data']

    coords = {loc["id"]: {"lat": loc["lat"], "lng": loc["lng"]}
              for loc in location_data}

    costs = {}
    parents = {}

    for node in graph:
        costs[node] = inf
        parents[node] = {}  # path to node

    costs[start] = 0
    # print(f"costs = {costs}")

    def find_cheapest_node(costs, not_checked):
        lowest_cost = inf
        cheapest_node = None
        for node in not_checked:
            if costs[node] <= lowest_cost:
                lowest_cost = costs[node]
                cheapest_node = node
        return cheapest_node

    # shortest path
    not_checked = [node for node in costs]
    node = find_cheapest_node(costs, not_checked)
    # print(f"node = {node}")
    while not_checked:  # iterate over non-checked nodes
        #     print(f"Not Checked: {not_checked}")
        cost = costs[node]
        child_cost = graph[node]
        for c in child_cost:
            # if cost current path < cost of curr record, update cost
            #         print(f"c = {c}")
            if costs[c] > cost + child_cost[c]:
                costs[c] = cost + child_cost[c]
                # update parent node so we know to to backtrack to shortest path
                parents[c] = node

        not_checked.pop(not_checked.index(node))
        node = find_cheapest_node(costs, not_checked)

    # Build final path
    # iterate through parents dic

    if costs[stop] < inf:
        path = [stop]
        i = 0
        while start not in path:
            path.append(parents[path[i]])
            i += 1

        # print(f"The shortest path is {path[::-1]}")

    # data = {'path': [coord[loc] for loc in path[::-1]]}
    return JsonResponse({
        'path': [coords[loc] for loc in path[::-1]],
        'ids': [place_id for place_id in path[::-1]],
    }, safe=False)


def graph(request):
    location_data = json.loads(request.body)

    coords = {loc["id"]: {"lat": loc["lat"], "lng": loc["lng"]}
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

            edges.append((dist, loc1["id"], loc2["id"]))

            distances[loc1["id"]][loc2["id"]] = dist
            distances[loc2["id"]][loc1["id"]] = dist

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

    return JsonResponse({
        'to_display': to_display,
        'graph': graph,
    }, safe=False)
