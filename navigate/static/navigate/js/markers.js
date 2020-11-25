let topZ = 20;
const markerColor = '#ff3333';

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
        map.panTo(marker.position);
    }

    let icon = marker.icon;
    icon.fillColor = '#ffffff';
    icon.strokeColor = markerColor;
    marker.setIcon(icon);
    marker.label.color = markerColor;
    marker.zIndex = ++topZ;
}

async function unhighlightMarker(marker) {
    let icon = marker.icon;
    icon.fillColor = markerColor;
    icon.strokeColor = '#ffffff';
    marker.setIcon(icon);
    marker.label.color = '#ffffff';
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
        fillColor: markerColor,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 2,
        labelOrigin: labelOriginFilled,
    };

    const marker = new google.maps.Marker({
        map: map,
        icon: markerImage,
        // title: place.name,
        position: place.geometry.location,
        label: { text: `${index}`, color: '#FFFFFF' },
        zIndex: -index,
    });

    // const markerinfowindow = await createInfoWindow(place);
    const markerinfowindow = await createInfoWindow(marker.position, place);
    
    markerinfowindow.setMap(map);
    markerinfowindow.hide()

    // store info window so it can be cleared
    infoWindows.push(markerinfowindow);

    // Mouseover
    marker.addListener("mouseover", () => {
        highlightMarker(marker);
        markerinfowindow.show();
    });

    // Mouseout
    marker.addListener("mouseout", () => {
        unhighlightMarker(marker);
        markerinfowindow.hide();
    });

    // Scroll to Place
    marker.addListener("click", () => {
        itineraryCreated ? expandItineraryEntry(place.place_id) : scrollResults(place.place_id);
    });

    // save marker for later reference
    markers[place.place_id] = marker;
}

async function filterMarkers(ids) {
    let index = 1;

    for (let id of ids) {
        markers[id].setMap(map);
        markers[id].zIndex = -index;
        markers[id].label.text = index++;

        // extend bounds to include marker on map
        bounds.extend(markers[id].position);
    }
    // show map with all markers visible
    map.fitBounds(bounds);
}

async function resetMarkers(places) {
    let index = 1;
    for (let place of places) {
        markers[place.place_id].setMap(map);
        markers[place.place_id].zIndex = -index;
        markers[place.place_id].label.text = index++;
    }
}