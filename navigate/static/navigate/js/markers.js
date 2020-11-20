let topZ = 20;

function hideMarkers() {
    if (!markers) return;

    Object.values(markers).forEach((marker) => {
        marker.setMap(null);
    });

    topZ = 20;
}

async function highlightMarker(marker) {
    // move map position to include marker if not visible
    if (!map.getBounds().contains(marker.position)) {
        let newCenter = {
            lat: .9 * marker.position.lat() + .1 * map.getCenter().lat(),
            lng: .9 * marker.position.lng() + .1 * map.getCenter().lng(),
        };
        map.panTo(newCenter);
    }

    let icon = marker.icon;
    icon.fillColor = '#FFDD33';
    marker.setIcon(icon);
    marker.zIndex = ++topZ;
}

async function unhighlightMarker(marker) {
    let icon = marker.icon;
    icon.fillColor = '#FF3333';
    marker.setIcon(icon);
}

async function createMarkers(places) {
    for (let i = 0, place; (place = places[i]); i++) {
        createMarker(place, i + 1);

        // extend bounds to include marker on map
        bounds.extend(place.geometry.location);
    }
    // show map with all markers visible
    map.fitBounds(bounds);
}

async function createMarker(place, index) {
    // Pick your pin (hole or no hole)
    // const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    // const labelOriginHole = new google.maps.Point(12, 15);
    const pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    const labelOriginFilled = new google.maps.Point(12, 9);

    const markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGFilled,
        anchor: new google.maps.Point(12, 22),
        fillOpacity: 1,
        fillColor: '#FF3333',
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 2,
        labelOrigin: labelOriginFilled,
    };

    const marker = new google.maps.Marker({
        map: map,
        icon: markerImage,
        title: place.name,
        position: place.geometry.location,
        label: { text: "" + index, color: '#FFFFFF' },
        zIndex: -index,
    });

    const markerinfowindow = await createInfoWindow(place);

    // Mouseover
    marker.addListener("mouseover", () => {
        highlightMarker(marker);
        markerinfowindow.open(map, marker);
    });

    // Mouseout
    marker.addListener("mouseout", () => {
        unhighlightMarker(marker);
        markerinfowindow.close();
    });

    // Scroll to Place
    marker.addListener("click", () => {
        scrollResults(place.place_id);
    });

    // save marker for later reference
    markers[place.place_id] = marker;
}

async function createInfoWindow(place) {
    return new google.maps.InfoWindow({
        content: $('<div>').append(
            // picture
            place.photos ? $('<div>').append(
                $('<img>').addClass('result-photo').attr('src', place.photos[0].getUrl())
            ).addClass('photo-container-2') : $(),

            // place info
            $('<div>').addClass('info-container-2').append(
                // name
                $('<strong>').text(place.name),
                // rating

                place.rating ? $('<div>').text(`rating: ${place.rating}`) : $(),

                // address
                $('<div>').text(place.vicinity.split(',')[0]),
            ),
        )[0],
        // prevents map from moving
        // disableAutoPan: true, 
    });
}

async function filterMarkers(ids) {
    for (let id of ids) {
        markers[id].setMap(map);

        // extend bounds to include marker on map
        bounds.extend(markers[id].position);
    }
    // show map with all markers visible
    map.fitBounds(bounds);
}