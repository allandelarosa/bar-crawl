function doDijkstra() {
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
    .then((data) => {
        let answer = data
        // console.log(answer)
        // for (let point of answer.path) {
        //     let marker = new google.maps.Marker({
        //         map: map,
        //         position: point
        //     });
        // }
        path = new google.maps.Polyline({
            path: answer,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        path.setMap(map)
    });
}

function createGraph() {
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
    .then((data) => {
        let answer = data.to_display;
        graph = data.graph;

        // to display graph

        // for (let pair of answer) {
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

function updateToVisit(place, addingTo) {
    // clear current path if updating
    if (path) path.setMap(null);

    if (addingTo === 'start') {
        // update start point
        startPoint = {
            name: place.name, 
            lat: place.geometry.location.lat(), 
            lng: place.geometry.location.lng()
        };

        // check if end point is start point
        if (!$.isEmptyObject(endPoint) && endPoint.name === place.name) {
            endPoint = {};
            replaceItineraryEntry('end', 'start', place);
        } else {
            updateItinerary(place, 'start');
        }
    } else {
        // update end point
        endPoint = {
            name: place.name, 
            lat: place.geometry.location.lat(), 
            lng: place.geometry.location.lng()
        }

        // check if end point is start point
        if (!$.isEmptyObject(startPoint) && startPoint.name === place.name) {
            startPoint = {};
            replaceItineraryEntry('start', 'end', place);
        } else {
            updateItinerary(place, 'end');
        }
    };

    // enable button if valid start and end
    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        $('#do-dijkstra').fadeIn();
    }

    if (itineraryMinimized) minimizeItineraryControl();
}