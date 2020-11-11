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

    $(li).hover(
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    );

    $(infoContainer).click(() => {
        if (place.place_id === expanded) {
            unexpandSearchResult();
        } else {
            let request = { placeId: place.place_id }
            service.getDetails(request, (place, status) => {
                scrollResults(place);
            });
        }
    });

    return li
}

function expandSearchResult(place) {
    // do nothing if already expanded
    if (place.place_id === expanded) return;

    expanded = place.place_id;

    let li = document.getElementById(place.place_id);

    // if reviews available, display them
    if (place.reviews) {
        let reviewContainer = document.createElement('div');
        reviewContainer.classList.add('review-container');

        const maxlen = 100;
        let reviewText = place.reviews[0].text;

        if (reviewText.length > maxlen) {
            let shortText = `"` + reviewText.substring(0, maxlen) + `..."<br>`;

            showLess(reviewContainer, shortText, reviewText);

        } else {
            reviewContainer.innerHTML = `"` + place.reviews[0].text + `"`;
        }

        li.appendChild(reviewContainer);
    }

    // add buttons to add to itinerary
    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    let start = document.createElement('button');
    let end = document.createElement('button');

    start.innerHTML = "Set as start"
    end.innerHTML = "Set as end"

    start.classList.add('btn', 'btn-dark');
    end.classList.add('btn', 'btn-dark');

    $(start).click(() => {
        updateToVisit(place, 'start');
    });

    $(end).click(() => {
        updateToVisit(place, 'end');
    });

    buttonsContainer.appendChild(start);
    buttonsContainer.appendChild(end);

    li.appendChild(buttonsContainer);
}

function unexpandSearchResult() {
    let li = document.getElementById(expanded);

    let review = li.getElementsByClassName('review-container')[0];
    let buttons = li.getElementsByClassName('buttons-container')[0];

    if (review) li.removeChild(review);
    li.removeChild(buttons);

    expanded = "";
}

function showLess(reviewContainer, shortText, reviewText) {
    let link = reviewContainer.getElementsByClassName('show-more-link')[0];
    if (link) reviewContainer.removeChild(link);

    reviewContainer.innerHTML = shortText;
    let showmorelink = document.createElement('a');
    showmorelink.innerHTML = 'Read more';
    showmorelink.classList.add('show-more-link');

    $(showmorelink).click(() => {
        showMore(reviewContainer, shortText, reviewText)
    });
    reviewContainer.appendChild(showmorelink);
}

function showMore(reviewContainer, shortText, reviewText) {
    let link = reviewContainer.getElementsByClassName('show-more-link')[0];
    reviewContainer.removeChild(link);

    reviewContainer.innerHTML = `"` + reviewText + `"<br>`;

    let showlesslink = document.createElement('a');
    showlesslink.innerHTML = 'Show less';
    showlesslink.classList.add('show-more-link');

    $(showlesslink).click(() => {
        showLess(reviewContainer, shortText, reviewText)
    });
    reviewContainer.appendChild(showlesslink);
}

function scrollResults(place) {
    // if another entry already expanded, unexpand it
    if (expanded.length > 0) unexpandSearchResult();

    expandSearchResult(place);

    document.getElementById(place.place_id).scrollIntoView({ behavior: "smooth" });
}