function doDjikstra() {
    const request = new Request(
        "/djikstra/path/", {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            'location_data': location_data,
            'start_point': toVisit[0],
            'end_point': toVisit[1]
        }),
    });

    console.log(request)

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
        let flightPlanCoordinates = answer.path
        let flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        flightPath.setMap(map)
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
        let answer = data
        
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

function updateToVisit(place) {
    if (toVisit.length >= 1 && toVisit[0].name === place.name) {
        toVisit.shift();
        djikstraButton.disabled = true;
    } else if (toVisit.length == 2 && toVisit[1].name === place.name) {
        toVisit.pop();
        djikstraButton.disabled = true;
    } else { 
        if (toVisit.length == 2) {
            toVisit.shift();
        }
        toVisit.push({
            "name": place.name, 
            "lat": place.geometry.location.lat(), 
            "lng": place.geometry.location.lng()
        });
        if (toVisit.length == 2) {
            djikstraButton.disabled = false;
        }
    }
}