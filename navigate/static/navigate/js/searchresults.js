function createSearchResult(place, index) {
    let li =  $('<li>').attr('id', place.place_id)[0];

    // name of place
    $(li).append(
        $('<div>').addClass('search-result-title-bar').append(
            $('<strong>').text(`${index}. `),
            $('<strong>').text(`${place.name}`).addClass('search-result-title'),
        ),
    ).click(() => {
        scrollResults(place);
    });

    // picture of place
    if (place.photos != null) {
        $(li).append(
            $('<div>').addClass('photo-container').append( 
                $('<img>').addClass('result-photo').attr('src', place.photos[0].getUrl())
            )
        );
    }

    // rating
    if (place.rating) {
        $(li).append(
            $('<div>').text(
                `Rating: ${place.rating} (${place.user_ratings_total})`
            )
        );
    }

    //address
    $(li).append(place.vicinity.split(',')[0]);

    // opening hours
    if (place.opening_hours) {
        $(li).append(
            $('<div>').text(
                place.opening_hours.open_now ? 'Open now' : 'Closed'
            )
        );
    }

    // buttons to set as start and end
    $(li).append(
        $('<div>').addClass('buttons-container').append(
            $('<button>').addClass('btn btn-dark start-end-btn').text('Set as start').click(() => {
                updateToVisit(place, 'start');
            }),
            $('<button>').addClass('btn btn-dark start-end-btn').text('Set as end').click(() => {
                updateToVisit(place, 'end');
            }),
        )
    );

    // highlight corresponding marker when hovering
    $(li).hover(
        () => {highlightMarker(markers[place.place_id])},
        () => {unhighlightMarker(markers[place.place_id])},
    );
    
    return li;
}

function scrollResults(place) {
    // if this is already expanded, do nothing
    if (expanded === place.place_id) return;

    // if another entry already expanded, unexpand it
    if (expanded.length > 0) {
        $(`#${expanded} .buttons-container`).slideUp();
        expanded = "";
    }

    // make search result visible
    $(`#${place.place_id}`)[0].scrollIntoView({ behavior: "smooth", block: "center" });

    // show buttons
    expanded = place.place_id;
    $(`#${expanded} .buttons-container`).slideDown();
}