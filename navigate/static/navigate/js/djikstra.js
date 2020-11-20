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

        // update markers and result list to itinerary
        bounds = new google.maps.LatLngBounds();
        hideMarkers();
        filterMarkers(response.ids);
        createItinerary(response.ids);

        path = new google.maps.Polyline({
            path: response.path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        path.setMap(map);
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
        if (!$.isEmptyObject(endPoint) && endPoint.name === place.name) {
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
        if (!$.isEmptyObject(startPoint) && startPoint.name === place.name) {
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