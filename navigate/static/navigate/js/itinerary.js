async function createItinerary(places, ids) {
    // set title
    $('#search-title').text('Your Itinerary');

    $('#search-results')[0].scrollTop = 0;
    $('#search-results').hide().empty();

    let index = 1;
    for (let id of ids) {
        for (let place of places) {
            if (place.place_id === id) {
                $('#search-results').append(await createItineraryEntry(place, index++));
                break;
            }
        }
    }

    $('#search-results').fadeIn();
}

async function createItineraryEntry(place, index) {
    return $('<li>').attr('id', place.place_id).append(
        // name
        $('<div>').addClass('search-result-title-bar').append(
            $('<strong>').addClass('place-index').text(`${index}. `),
            $('<strong>').text(place.name).addClass('place-name'),
        ),
    ).click(() => {
        // center and expand result when clicked
        scrollResults(place.place_id);
    }).hover(
        // highlight corresponding markers when hovering
        () => {highlightMarker(markers[place.place_id])},
        () => {unhighlightMarker(markers[place.place_id])},
    );
}