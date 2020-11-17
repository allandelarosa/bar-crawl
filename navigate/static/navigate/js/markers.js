function clearMarkers() {
    Object.values(markers).forEach((marker) => {
        marker.setMap(null);
    });
    markers = {};
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
    marker.zIndex += 30;
}

async function unhighlightMarker(marker) {
    let icon = marker.icon;
    icon.fillColor = '#FF3333';
    marker.setIcon(icon);
    marker.zIndex -= 30;
}

function createMarkers(places) {
    labelIndex = 1;
    var pinColor = '#FF3333';

    // Pick your pin (hole or no hole)
    var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
    var labelOriginHole = new google.maps.Point(12, 15);
    var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
    var labelOriginFilled = new google.maps.Point(12, 9);

    var markerImage = {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        path: pinSVGFilled,
        anchor: new google.maps.Point(12, 22),
        fillOpacity: 1,
        fillColor: pinColor,
        strokeWeight: 2,
        strokeColor: "#ffffff",
        scale: 2,
        labelOrigin: labelOriginFilled,
    };


    for (let i = 0, place; (place = places[i]); i++) {
        let marker = new google.maps.Marker({
            map: map,
            icon: markerImage,
            title: place.name,
            position: place.geometry.location,
            label: { text: "" + labelIndex, color: '#FFFFFF' },
            zIndex: -(labelIndex),
        });


        const li = document.createElement("div");

        let photoContainer = document.createElement('div');
        let infoContainer = document.createElement('div');

        photoContainer.classList.add('photo-container-2');
        infoContainer.classList.add('info-container-2');

        infoContainer.innerHTML =
            "<div>" +
            "<div class='nameTitle'>" +
            place.name +
            "</div>"
            +
            "rating: " +
            place.rating +
            " " +
            (place.price_level) +
            "<br>" +
            place.vicinity +
            "</div>"

        if (place.photos != null) {
            let photo = document.createElement('img');
            let firstPhoto = place.photos[0];
            photo.classList.add('result-photo');
            photo.src = firstPhoto.getUrl();
            photoContainer.appendChild(photo)
        }

        li.appendChild(photoContainer);
        li.appendChild(infoContainer);

        const markerinfowindow = new google.maps.InfoWindow({
            content: li,
            // prevents map from moving
            // disableAutoPan: true, 
        });

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

        markers[place.place_id] = marker
        placesList.appendChild(createSearchResult(place, labelIndex++));

        // Scroll to Place
        marker.addListener("click", () => {
            scrollResults(place);
        });

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}