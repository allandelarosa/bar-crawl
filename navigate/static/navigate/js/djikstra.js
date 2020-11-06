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

function displayGraph() {
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
        for (let pair of answer) {
            let edge = new google.maps.Polyline({
                path: pair,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            edge.setMap(map)
        }
    });
}

function updateToVisit(place, addingTo) {
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
            removeItineraryEntry('end');
            document.getElementById('do-dijkstra').disabled = true;
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
            removeItineraryEntry('start');
            document.getElementById('do-dijkstra').disabled = true;
        }
    };

    // enable button if valid start and end
    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        document.getElementById('do-dijkstra').disabled = false;
    }
}