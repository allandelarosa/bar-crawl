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
        // info
        $('<div>').addClass('info-container').append(
            // name
            $('<div>').addClass('search-result-title').append(
                $('<strong>').text(`${index}. `),
                $('<strong>').text(place.name).addClass('clickable-title'),
            ),

            $('<div>').addClass('place-info hidden').append(
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
                }).css('color', '#555'),

                // opening hours (deprecated)
                place.opening_hours ? (
                    place.opening_hours.open_now ?
                        $('<div>').text('Open now').css('color', 'green') :
                        $('<div>').text('Closed').css('color', 'red')
                ) : $(),
            ).hide(),
        ),
        // picture
        place.photos ? $('<div>').append(
            $('<img>').addClass(
                (place.photos[0].width > place.photos[0].height ? 'wide-photo' : 'long-photo'), 'result-photo'
            ).attr('src', place.photos[0].getUrl())
        ).addClass('photo-container hidden').hide() : $(),
    ).hover(
        // highlight corresponding markers when hovering
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    ).click(() => {
        expandItineraryEntry(place.place_id);
    });
}

async function expandItineraryEntry(id) {
    // if another element expanded, unexpand it first
    unexpandItineraryEntry($('.expanded').attr('id'));

    // grow for info
    $(`#${id} .hidden`).animate({ height: 'toggle', 'margin-top': 'toggle' }, () => {
        scrollResults(id);
    });

    // fade in elements
    $(`#${id} .hidden`).animate({ opacity: '1' });

    // swap listener from li to title
    $(`#${id}`).off('click').toggleClass('expanded').click(() => {
        scrollResults(id);
    });
    $(`#${id} .clickable-title`).click((event) => {
        event.stopPropagation();
        unexpandItineraryEntry(id);
    });
}

async function unexpandItineraryEntry(id) {
    // if nothing was expanded, do nothing
    if (!id) return;

    // fade out elements
    $(`#${id} .hidden`).animate({ opacity: '0' });

    // shrink space
    $(`#${id} .hidden`).animate({ height: 'toggle', 'margin-top': 'toggle' });

    // swap listener from title to li
    $(`#${id} .clickable-title`).off();
    $(`#${id}`).toggleClass('expanded').click(() => {
        expandItineraryEntry(id);
    });
    
}