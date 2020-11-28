function initMap() {
    const input = document.getElementById("address");
    geocoder = new google.maps.Geocoder();

    // check if user got to page correctly
    if (!input.value) redirectPage();

    // make logo redirect to landing page
    $('.logo-nav img').click(() => {
        window.location.href = "/";
    });

    geocoder.geocode({ address: input.value }, (results, status) => {
        if (status !== 'OK') return;

        position = results[0].geometry.location;
        let pos = {
            lat: position.lat(),
            lng: position.lng(),
        };

        // set map to specified loation
        map = new google.maps.Map(document.getElementById('map'), {
            center: pos,
            zoom: 15,
            mapTypeControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
            streetViewControl: false,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
            },
        });

        // add itinerary control to map
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push($('#itinerary-control')[0]);

        resetMap(pos);

        // have map listen for updates to search bar
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
        });
    });
}

function redirectPage() {
    if (navigator.geolocation) {
        // try html5 geolocation
        navigator.geolocation.getCurrentPosition(position => {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // perform search on user's location
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status !== 'OK') return;
                window.location.replace('/hop/' + results[0].formatted_address);
            });

        }, () => {
            // use default location if geolocation denied
            window.location.replace('/hop/New York, NY, USA');
        });
    } else {
        // use default location if geolocation not supported
        window.location.replace('/hop/New York, NY, USA');
    }
}

function resetMap(pos) {
    location_data = [];
    graph = {};

    // reset itinerary control on new search
    // $('#do-dijkstra').hide();
    $('#itinerary-control').hide();

    itineraryControlVisible = false;
    if (itineraryControlMinimized) minimizeItineraryControl();

    itineraryCreated = false;

    expanded = "";
    startPoint = {};
    endPoint = {};

    hideMarkers();
    markers = {};
    clearInfoWindows();
    infoWindows = [];

    if (path) path.setMap(null);

    bounds = new google.maps.LatLngBounds();
    bounds.extend(pos);
    map.setCenter(pos);

    getNearbyPlaces(pos, true);
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
    // handle zero results
    if (status === 'ZERO_RESULTS') {
        $('#search-title').text('No Bars in Your Area!');
        $('#search-results').hide().empty();
    }

    // any other error, not sure how to handle
    if (status !== 'OK') return;

    location_data = []
    for (let place of results) {
        location_data.push({
            id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        })
    }

    dijkstraItineraryControl();

    createSearchResults(results);
    createMarkers(results);
    createGraph();
    clearItineraryControl();

    $('#do-dijkstra').off().click(() => {
        doDijkstra(results);
    });
}