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
                console.log(position)
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                geocoder.geocode({location: pos}, (results, status) => {
                    if (status === 'OK') {
                        // console.log(results[0]);
                        window.location.replace('/hop/' + results[0].formatted_address)
                    }
                });
            }

            geocoder.geocode({address: input.value}, (results, status) => {
                if (status === 'OK') {
                    position = results[0].geometry.location;
                
                    let pos = {
                        lat: position.lat(),
                        lng: position.lng(),
                    };

                    map = new google.maps.Map(document.getElementById('map'), {
                        center: pos,
                        zoom: 15
                    });
                    
                    setMap(pos);
                    getNearbyPlaces(pos);

                    const searchBox = new google.maps.places.SearchBox(input);
                    map.addListener("bounds_changed", () => {
                        searchBox.setBounds(map.getBounds());
                    });
                    searchBox.addListener("places_changed", () => {
                        const places = searchBox.getPlaces();
                        let newpos = places[0].geometry.location;

                        setMap(newpos)
                        getNearbyPlaces(newpos);
                    });
                }
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
    getNearbyPlaces(pos);
}


function setMap(pos) {
    clearMarkers();
    location_data = [];
    toVisit = [];
    djikstraButton.disabled = true;
    placesList.innerHTML = "";
    graph = {};
    
    if (path) path.setMap(null);

    bounds = new google.maps.LatLngBounds();
    bounds.extend(pos);

    map.setCenter(pos);
}


// Perform a Places Nearby Search Request
function getNearbyPlaces(position) {
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: ['bar'],
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}


// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status !== "OK") return;
    createMarkers(results);
    location_data = []
    for (let data of results) {
        location_data.push({ 
            name: data.name, 
            lat: data.geometry.location.lat(), 
            lng: data.geometry.location.lng() 
        })
    }

    displayGraph();
}


// // Builds an InfoWindow to display details above the marker
// function showDetails(placeResult, marker, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//         let placeInfowindow = new google.maps.InfoWindow();
//         placeInfowindow.setContent('<div><strong>' + placeResult.name +
//             '</strong><br>' + 'Rating: ' + placeResult.rating + '</div>');
//         placeInfowindow.open(marker.map, marker);
//         currentInfoWindow.close();
//         currentInfoWindow = placeInfowindow;
//     } else {
//         console.log('showDetails failed: ' + status);
//     }
// }