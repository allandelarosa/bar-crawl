function doDijkstra(places) {
    if (path) path.setMap(null);

    const request = new Request(
        "/djikstra/path/", {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            location_data: location_data,
            graph: graph,
            start_point: startPoint,
            end_point: endPoint,
        }),
    });

    fetch(request)
        .then(response => response.json())
        .then((response) => {
            // console.log(response.path);
            // console.log(response.ids);

            $('#itinerary-control').hide();

            // update markers and result list to itinerary
            bounds = new google.maps.LatLngBounds();
            hideMarkers();
            filterMarkers(response.ids);
            expanded = "";
            createItinerary(places, response.ids);

            path = new google.maps.Polyline({
                geodesic: true,
                strokeColor: '#ff3333',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: map,
            });

            let storedPath = [response.path[0]];
            let totalDist = response.distances.reduce((a, b) => a + b, 0);

            $('#search-results').fadeIn(1000, () => {
                expandItineraryEntry(response.ids[0]);
            });
            drawPath(0, response.distances, totalDist, response.path, storedPath, places);
        });
}

async function createGraph() {
    const request = new Request(
        "/djikstra/graph/", {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(location_data),
    });

    fetch(request)
        .then(response => response.json())
        .then((response) => {
            graph = response.graph;

            // to display graph

            // for (let pair of response.to_display) {
            //     let edge = new google.maps.Polyline({
            //         path: pair,
            //         geodesic: true,
            //         strokeColor: '#FF0000',
            //         strokeOpacity: 1.0,
            //         strokeWeight: 2
            //     });
            //     edge.setMap(map)
            // }
        });
}

// set start and end points
function updateToVisit(place, addingTo) {
    if (addingTo === 'start') {
        // update start point
        startPoint = {
            id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        // check if end point is start point
        if (!$.isEmptyObject(endPoint) && endPoint.id === place.place_id) {
            endPoint = {};
            replaceItineraryControlEntry('end', 'start', place);
        } else {
            updateItineraryControl(place, 'start');
        }
    } else {
        // update end point
        endPoint = {
            id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }

        // check if end point is start point
        if (!$.isEmptyObject(startPoint) && startPoint.id === place.place_id) {
            startPoint = {};
            replaceItineraryControlEntry('start', 'end', place);
        } else {
            updateItineraryControl(place, 'end');
        }
    };

    // enable button if valid start and end
    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        $('#do-dijkstra').fadeIn();
    }

    if (itineraryControlMinimized) minimizeItineraryControl();
}

// animation for path
function drawPath(i, dists, totalDist, bars, storedPath, places) {
    // stop animation after all section drawn
    if (i == dists.length) {
        searchResetControl(places);
        return;
    }

    // speed of animation
    const step = 5;
    // time for animation of entire path
    const totalTime = 1000;

    let start = bars[i];
    let end = bars[i + 1];

    // calculate fraction of time for this section
    let animTime = (dists[i] / totalDist) * totalTime;

    // temp line that will be animated but replaces
    let line = new google.maps.Polyline({
        path: [start, start],
        geodesic: true,
        strokeColor: '#ff3333',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
    });

    let currTime = 0;

    let interval = setInterval(() => {
        currTime += step;
        if (currTime > animTime) {
            clearInterval(interval);

            // update actual line
            storedPath.push(end);
            path.setPath(storedPath);

            // remove temp line
            line.setMap(null);

            // draw next section
            drawPath(i + 1, dists, totalDist, bars, storedPath, places);
        } else {
            // update current section of temp line
            line.setPath([start, nextPoint(start, end, currTime, animTime)]);
        }
    }, step);
}

// calculate point between start and end to draw to
function nextPoint(a, b, curr, total) {
    let ratio = curr / total;

    let lat = a.lat + (b.lat - a.lat) * ratio;
    let lng = a.lng + (b.lng - a.lng) * ratio;

    return { lat: lat, lng: lng };
}