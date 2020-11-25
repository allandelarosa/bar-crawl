async function createSearchResults(places) {
    // set search title
    $('#search-title').text(`Top ${places.length} Bars in the Area`);

    // reset search list
    $('#search-results')[0].scrollTop = 0;
    $('#search-results').hide().empty();

    for (let i = 0, place; (place = places[i]); i++) {
        // add new search result
        let result = await createSearchResult(place, i + 1);
        $('#search-results').append(result);
    }

    $('#search-results').fadeIn();
}

async function createSearchResult(place, index) {
    return $('<li>').attr('id', place.place_id).append(
        // info
        $('<div>').addClass('info-container').append(
            // name
            $('<div>').addClass('search-result-title').append(
                $('<strong>').text(`${index}. ${place.name}`),
            ),

            $('<div>').addClass('place-info').append(
                // ratings
                place.rating ? $('<div>').append(
                    // rating number
                    $('<div>').text(`${place.rating} `).css('color', ' #fb0'),
                    // star rating
                    $('<div>').addClass('Stars').css('--rating', `${place.rating}`),
                    // number of ratings
                    $('<div>').text(`(${place.user_ratings_total})`).css('color', ' #ccc'),
                ).addClass('ratings-container') : $(),

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
                }),

                // opening hours (deprecated)
                place.opening_hours ? (
                    place.opening_hours.open_now ?
                        $('<div>').text('Open now').css('color', 'green') :
                        $('<div>').text('Closed').css('color', 'red')
                ) : $(),
            ),

            // buttons to set as start and end
            $('<div>').addClass('button-container').append(
                $('<button>').addClass('btn btn-outline-dark btn-sm').text('Set as start').click(() => {
                    updateToVisit(place, 'start');
                }),
                $('<button>').addClass('btn btn-outline-dark btn-sm').text('Set as end').click(() => {
                    updateToVisit(place, 'end');
                }),
            ),
        ),
        // picture
        place.photos ? $('<div>').append(
            $('<img>').addClass(
                (place.photos[0].width > place.photos[0].height ? 'wide-photo' : 'long-photo'), 'result-photo'
            ).attr('src', place.photos[0].getUrl())
        ).addClass('photo-container') : $(),
    ).hover(
        // highlight corresponding markers when hovering
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    ).click(() => {
        scrollResults(place.place_id);
    });
}

async function scrollResults(id) {
    // make search result visible
    $(`#${id}`)[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}