function clearMarkers() {
    Object.values(markers).forEach((marker) => {
        marker.setMap(null);
    });
    markers = {};
}

function highlightMarker(marker) {
    let icon = marker.icon;
    icon.fillColor = '#FFDD33';
    marker.setIcon(icon);
    marker.zIndex += 30;
}

function unhighlightMarker(marker) {
    let icon = marker.icon;
    icon.fillColor = '#FF3333';
    marker.setIcon(icon);
    marker.zIndex -= 30;
}

function createMarkers(places) {
    labelIndex = 1;
    for (let i = 0, place; (place = places[i]); i++) {
        const defaultMarker = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            strokeColor: '#000000',
            strokeWeight: 2,
            fillColor: '#FF3333',
            fillOpacity: 1,
        };
        
        let marker = new google.maps.Marker({
            map: map,
            icon: defaultMarker,
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
        "<div class='nameTitle'>"+
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

        var node = document.createTextNode("This is a new paragraph.");

        // photoContainer.textContent = place.name;

        if (place.photos != null) {
        let photo = document.createElement('img');
        let firstPhoto = place.photos[0];
        photo.classList.add('result-photo');
        photo.src = firstPhoto.getUrl();
        photoContainer.appendChild(photo)
        // photoContainer.appendChild(node)

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