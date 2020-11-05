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

    li.id = place.place_id;
    expanded[place.place_id] = false;

    li.addEventListener("mouseover", () => {
        highlightMarker(markers[place.place_id]);
    });

    li.addEventListener("mouseout", () => {
        unhighlightMarker(markers[place.place_id]);
    });

    infoContainer.addEventListener("click", () => {
        let request = { placeId: place.place_id }
        service.getDetails(request, (place, status) => {
            // console.log(place);

            expandSearchResult(place, li)

        });

        // updateToVisit(place);
    });

    return li
}

function expandSearchResult(place, li) {
    if (expanded[place.place_id]) {
        let review = li.getElementsByClassName('review-container')[0];

        let buttons = li.getElementsByClassName('buttons-container')[0];

        li.removeChild(review);
        li.removeChild(buttons);
        expanded[place.place_id] = false;
    } else {
        if (place.reviews) {
            let reviewContainer = document.createElement('div');
            reviewContainer.classList.add('review-container');

            const maxlen = 100;
            let reviewText = place.reviews[0].text;

            if (reviewText.length > maxlen) {
                let shorttext = reviewText.substring(0, maxlen);
                shorttext += '... ';

                reviewContainer.innerHTML = shorttext;
                let showmorelink = document.createElement('a');
                showmorelink.innerHTML = 'Read more';
                showmorelink.classList.add('show-more-link');

                showmorelink.addEventListener('click', () => { showMore(reviewContainer, reviewText) });
                reviewContainer.appendChild(showmorelink);

            } else {
                reviewContainer.innerHTML = `"` + place.reviews[0].text + `"`;
            }

            li.appendChild(reviewContainer);
        }
        expanded[place.place_id] = true;

        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');

        let start = document.createElement('button');
        let end = document.createElement('button');

        start.innerHTML = "Set as start"
        end.innerHTML = "Set as end"

        start.classList.add('btn', 'btn-dark');
        end.classList.add('btn', 'btn-dark');

        start.addEventListener("click", () => {
            updateItinerary(place, 'start');
        });

        end.addEventListener("click", () => {
            updateItinerary(place, 'end');
        });

        buttonsContainer.appendChild(start);
        buttonsContainer.appendChild(end);

        li.appendChild(buttonsContainer);
    }
}

function showMore(reviewContainer, reviewText) {
    let link = reviewContainer.getElementsByClassName('show-more-link')[0];
    reviewContainer.removeChild(link);

    reviewContainer.innerHTML = reviewText;
}

function scrollResults(place_id) {
    document.getElementById(place_id).scrollIntoView({ behavior: "smooth" });
}