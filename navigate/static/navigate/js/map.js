function initMap() {
    // Initialize variables
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const input = document.getElementById("address");
            let geocoder = new google.maps.Geocoder();

            if (input.value === "") {
                // console.log(position)
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                geocoder.geocode({ location: pos }, (results, status) => {
                    if (status === 'OK') {
                        // console.log(results[0]);
                        window.location.replace('/hop/' + results[0].formatted_address)
                    }
                });
            }

            geocoder.geocode({ address: input.value }, (results, status) => {
                if (status !== 'OK') return;

                position = results[0].geometry.location;

                let pos = {
                    lat: position.lat(),
                    lng: position.lng(),
                };

                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 15,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM,
                    },
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM,
                    },
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM,
                    },
                });

                map.controls[google.maps.ControlPosition.RIGHT_TOP].push(createItineraryControl());

                resetMap(pos);
                getNearbyPlaces(pos, true);

                const searchBox = new google.maps.places.SearchBox(input);
                map.addListener("bounds_changed", () => {
                    searchBox.setBounds(map.getBounds());
                });

                searchBox.addListener("places_changed", () => {
                    // change url of page without redirecting
                    window.history.replaceState("", "", "/hop/" + input.value);

                    const places = searchBox.getPlaces();
                    let newpos = places[0].geometry.location;

                    resetMap(newpos)
                    getNearbyPlaces(newpos, true);
                });
            });
        }, () => {
            // Browser supports geolocation, but user has denied permission
            handleLocationError(true, infoWindow);
        });
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow);
    }
}


// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to Sydney, Australia
    let pos = { lat: -33.856, lng: 151.215 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Geolocation permissions denied. Using default location.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;

    // Call Places Nearby Search on the default location
    resetMap(pos);
    getNearbyPlaces(pos, true);
}


function resetMap(pos) {
    location_data = [];
    graph = {};

    // hide itinerary control on new search
    $('#do-dijkstra').hide();
    $('#itinerary-control').hide();
    clearItinerary();
    itineraryVisible = false;
    if (itineraryMinimized) minimizeItineraryControl();

    expanded = "";
    startPoint = {};
    endPoint = {};

    hideMarkers();
    markers = {};
    searchResults = {};

    if (path) path.setMap(null);

    bounds = new google.maps.LatLngBounds();
    bounds.extend(pos);

    map.setCenter(pos);
}


// Perform a Places Nearby Search Request
function getNearbyPlaces(position, busy) {
    /* 
        rank by prominence gives more relevant results,
        but hard to define corresponding radius (very 
        small for cities, larger for suburban)

        rank by distance gives 20 nearest results which
        may not necessarily be 'bars', but radius is not
        mandatory
    */

    // if 'busy' area, use shorter radius
    let request = {
        location: position,
        radius: busy ? '500' : '1000',
        rankBy: google.maps.places.RankBy.PROMINENCE,
        // rankBy: google.maps.places.RankBy.DISTANCE,
        type: ['bar'],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (busy && results.length < 10) {
            getNearbyPlaces(position, false);
        } else {
            nearbyCallback(results, status);
        }
    });
}


// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status !== "OK") return;

    location_data = []
    for (let place of results) {
        location_data.push({
            id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        })
    }

    createSearchResults(results);
    createMarkers(results);
    createGraph();

    $('#do-dijkstra').off().click(() => {
        doDijkstra(results);
    })

}