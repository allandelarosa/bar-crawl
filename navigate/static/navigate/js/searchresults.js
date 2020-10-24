function createSearchResult(place, index) {
    let li = document.createElement("li");

    let infoContainer = document.createElement('div');
    let photoContainer = document.createElement('div');

    photoContainer.classList.add('photo-container');
    infoContainer.classList.add('info-container');

    infoContainer.innerHTML = '<strong>' + index + '. ' + place.name + '</strong><br>'

    if (place.rating) {
        infoContainer.innerHTML += 'Rating: ' + place.rating + ' (' + place.user_ratings_total + ')<br>'
    }

    infoContainer.innerHTML += place.vicinity + '<br>'

    if (place.opening_hours) {
        if (place.opening_hours.open_now) {
            infoContainer.innerHTML += 'Open now <br>'
        } else {
            infoContainer.innerHTML += 'Closed <br>'
        }
    }

    if (place.photos != null) {
        let photo = document.createElement('img');
        let firstPhoto = place.photos[0];
        photo.classList.add('result-photo');
        photo.src = firstPhoto.getUrl();
        photoContainer.appendChild(photo)
    }

    li.appendChild(photoContainer);
    li.appendChild(infoContainer);

    // li.id = place.place_id;

    li.addEventListener("mouseover", () => {
        highlightMarker(markers[place.place_id]);
    });

    li.addEventListener("mouseout", () => {
        unhighlightMarker(markers[place.place_id]);
    });

    li.addEventListener("click", () => {
        updateToVisit(place);
    });

    return li
}