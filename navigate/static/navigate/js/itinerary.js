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

        $('<div>').addClass('hidden-container').append(
            // picture
            place.photos ? $('<div>').append(
                $('<img>').addClass('result-photo').attr('src', place.photos[0].getUrl())
            ).addClass('photo-container') : $(),

            // ratings
            place.rating ? $('<div>').append(
                // rating number
                $('<div>').text(`${place.rating} `).css('color', ' #fb0'),
                // star rating
                $('<div>').addClass('Stars').css('--rating', `${place.rating}`),
                // number of ratings
                $('<div>').text(`(${place.user_ratings_total})`).css('color', ' #ccc'),
            ).addClass('ratings-container') : $(),
            place.rating ? $('<br>') : $(),

            // price level and address
            $('<div>').html(() => {
                let info = ''
                // get price level
                if (place.price_level) {
                    let price_level = place.price_level;
                    while (price_level-- > 0) info += '$';

                    info += ' &#183; ';
                }

                // get address
                info += place.vicinity.split(',')[0];

                return info;
            }).css('color', '#555'),

            // opening hours (deprecated)
            place.opening_hours ? (
                place.opening_hours.open_now ?
                    $('<div>').text('Open now').css('color', 'green') :
                    $('<div>').text('Closed').css('color', 'red')
            ) : $(),
        ),
    ).click((event) => {
        // center and expand result when clicked
        expandResult(event.target, place.place_id);
    }).hover(
        // highlight corresponding markers when hovering
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    );
}