function createSearchResult(place, index) {
    let li =  $('<li>').attr('id', place.place_id)[0];

    // name of place
    $(li).append(
        $('<div>').addClass('search-result-title-bar').append(
            $('<strong>').text(`${index}. `),
            $('<strong>').text(place.name).addClass('place-name'),
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

    // rating container
    if (place.rating) {
        $(li).append(
            $('<div>').addClass('ratings-container').append(
                // rating number
                $('<div>').text(`${place.rating} `).css('color', ' #fb0'),
                // star rating
                $('<div>').addClass('Stars').css('--rating', `${place.rating}`),
                // number of ratings
                $('<div>').text(`(${place.user_ratings_total})`).css('color', ' #ccc'),
            ),
            $('<br>')
        );
    }

    // price level and address
    $(li).append(
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
        }).css('color', '#555')
    );

    // opening hours
    if (place.opening_hours) {
        $(li).append(
            place.opening_hours.open_now ? 
            $('<div>').text('Open now').css('color', 'green') : 
            $('<div>').text('Closed').css('color', 'red')
        );
    }

    // buttons to set as start and end
    $(li).append(
        $('<div>').addClass('buttons-container').append(
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as start').click(() => {
                updateToVisit(place, 'start');
            }),
            $('<button>').addClass('btn btn-dark btn-sm start-end-btn').text('Set as end').click(() => {
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