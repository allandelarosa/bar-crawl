let map;
let service;
let infowindow;
let markers = [];

function initMap() {
    const sydney = new google.maps.LatLng(-33.867, 151.195);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: sydney,
        zoom: 15
    });
    var request = {
        location: sydney,
        radius: '10000',
        type: ['museum']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        console.log(results)
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++)
                createMarker(results[i]);
            map.setCenter(results[0].geometry.location);
        }
    });

    const geocoder = new google.maps.Geocoder();
    document.getElementsByClassName("submit")[0].addEventListener("click", () => {
        geocodeAddress(geocoder, map);
    });

}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
    });

    markers.push(marker);
    google.maps.event.addListener(marker, "click", () => {
        let content = "<strong>" + place.name + "</strong>"

        let infowindow = new google.maps.InfoWindow({
            content: content
        });

        infowindow.open(map, marker);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    deleteMarkers()
    const address = document.getElementById("address").value;
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            createMarker(results[0]);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}