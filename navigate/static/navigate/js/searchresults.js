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
        
        // save result for later reference
        searchResults[place.place_id] = result;
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
        ).addClass('ratings-container'): $(),
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

        // opening hours
        place.opening_hours ? (
            place.opening_hours.open_now ? 
            $('<div>').text('Open now').css('color', 'green') : 
            $('<div>').text('Closed').css('color', 'red')
        ) : $(),

        // buttons to set as start and end
        $('<div>').addClass('buttons-container').append(
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as start').click(() => {
                updateToVisit(place, 'start');
            }),
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as end').click(() => {
                updateToVisit(place, 'end');
            }),
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

function scrollResults(id) {
    // make search result visible
    $(`#${id}`)[0].scrollIntoView({ behavior: "smooth", block: "center" });

    // if result already expanded, do nothing else
    if (expanded === id) return;

    // if another entry already expanded, unexpand it
    if (expanded.length > 0) {
        $(`#${expanded} .buttons-container`).slideUp();
        expanded = "";
    }

    // show buttons
    expanded = id;
    $(`#${expanded} .buttons-container`).slideDown();
}

async function filterSearchResults(ids) {
    // set search title
    $('#search-title').text('Your Itinerary');

    // reset search list
    $('#search-results')[0].scrollTop = 0;
    $('#search-results').hide().empty();

    for (let id of ids) {
        // order search results
        $('#search-results').append(searchResults[id]);

        // hide index, number not useful anymore
        $(`#${id} .place-index`).hide();

        // reapply listeners (they go away for some reason)
        searchResults[id].click(() => {
            // center and expand result when clicked
            scrollResults(id);
        }).hover(
            // highlight corresponding markers when hovering
            () => {highlightMarker(markers[id])},
            () => {unhighlightMarker(markers[id])},
        );
    }

    $('#search-results').fadeIn();
}