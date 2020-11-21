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
        // name
        $('<div>').addClass('search-result-title-bar').append(
            $('<strong>').addClass('place-index').text(`${index}. `),
            $('<strong>').text(place.name).addClass('place-name'),
        ),

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
        // place.opening_hours ? (
        //     place.opening_hours.open_now ?
        //         $('<div>').text('Open now').css('color', 'green') :
        //         $('<div>').text('Closed').css('color', 'red')
        // ) : $(),

        // buttons to set as start and end
        $('<div>').addClass('hidden-container').append(
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as start').click(() => {
                updateToVisit(place, 'start');
            }),
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as end').click(() => {
                updateToVisit(place, 'end');
            }),
        ),
    ).click((event) => {
        expandResult(event.target, place.place_id);
    }).hover(
        // highlight corresponding markers when hovering
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    );
}

async function scrollResults(id) {
    // expand result
    expandResult(null, id);

    // make search result visible
    $(`#${id}`)[0].scrollIntoView({ behavior: "smooth"});
}

function expandResult(target, id) {
    // don't unexpand if result was not clicked
    if (!target && expanded === id) return;

    // if button or link was clicked, do nothing
    if (target) {
        if (target.tagName === 'BUTTON') return;
        if (target.tagName === 'A') return;
    }

    // if result was clicked and already expanded, unexpand
    if (expanded === id) {
        $(`#${expanded} .hidden-container`).slideUp();
        expanded = "";
        return;
    }

    // if another entry already expanded, unexpand it
    if (expanded.length > 0) {
        $(`#${expanded} .hidden-container`).hide();
    }

    // show hidden elements
    expanded = id;
    $(`#${expanded} .hidden-container`).slideDown();
}