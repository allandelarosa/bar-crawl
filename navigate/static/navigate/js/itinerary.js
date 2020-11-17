function createItineraryControl() {
    return $('#itinerary-control').append(
        // title bar
        $('<div>').addClass('itinerary-control-title').append(
            $('<button>').addClass('btn btn-outline-light').attr('id', 'minimize-button').append(
                $('<i>').addClass('fa fa-compress'),
            ).click(() => {
                minimizeItineraryControl();
            }),
            $('<strong>').text('Selected Bars'),
        ),

        // start and end entries
        $('<div>').attr('id','itinerary-start').addClass('itinerary-control-entry').append(
            $('<button>').addClass('btn btn-danger remove-button').append(
                $('<i>').addClass('fa fa-minus'),
            ).click(() => {
                removeItineraryEntry('start');
            }),
        ),

        $('<div>').attr('id','itinerary-end').addClass('itinerary-control-entry').append(
            $('<button>').addClass('btn btn-danger remove-button').append(
                $('<i>').addClass('fa fa-minus'),
            ).click(() => {
                removeItineraryEntry('end');
            }),
        ),

        // dijkstra button
        $('<button>').attr('id','do-dijkstra').text('Create Itinerary').click(() => {
            doDijkstra();
        }),
    )[0];
}

function updateItinerary(place, addingTo) {
    let itinerary = document.getElementById('itinerary');
    if (!itineraryVisible) {
        itineraryVisible = true;
        $('#itinerary-control').fadeIn();
    }

    if (addingTo === 'start') {
        showItineraryEntry(addingTo, place);
    }

    if (addingTo === 'end') {
        showItineraryEntry(addingTo, place);
    }
}

function clearItinerary() {
    removeItineraryEntry('start');
    removeItineraryEntry('end');
}

function showItineraryEntry(addingTo, place) {
    $(`#itinerary-${addingTo}`).off().find('div').remove();

    $(`#itinerary-${addingTo}`).append(
        $('<div>').text(
            `${addingTo === 'start' ? 'Start' : 'End'}: ${place.name}`
        ).addClass('place-name').click(() => {
            scrollResults(place)
        }).hover(
            () => { highlightMarker(markers[place.place_id]) },
            () => { unhighlightMarker(markers[place.place_id]) },
        ),
    );

    $(`#itinerary-${addingTo}`).fadeIn();
}

function removeItineraryEntry(addingTo) {
    $(`#itinerary-${addingTo}`).fadeOut();

    if (addingTo === 'start') {
        startPoint = {};
    } else {
        endPoint = {};
    }

    $('#do-dijkstra').fadeOut();

    if ($.isEmptyObject(startPoint) && $.isEmptyObject(endPoint)) {
        itineraryVisible = false;
        $('#itinerary-control').fadeOut();
    }
}

function replaceItineraryEntry(first, second, place) {
    $(`#itinerary-${first}`).hide();

    $(`#itinerary-${second} div`).text(
        (second === 'start' ? 'Start: ' : 'End: ') + place.name
    ).click(() => {
        scrollResults(place)
    }).hover(
        () => { highlightMarker(markers[place.place_id]) },
        () => { unhighlightMarker(markers[place.place_id]) },
    );
    $(`#itinerary-${second}`).show();
}

function minimizeItineraryControl() {
    $('#minimize-button i').toggleClass('fa-compress fa-expand');

    if (!$.isEmptyObject(startPoint)) {
        itineraryMinimized ? $('#itinerary-start').slideDown() : $('#itinerary-start').slideUp();
    }

    if (!$.isEmptyObject(endPoint)) {
        itineraryMinimized ? $('#itinerary-end').slideDown() : $('#itinerary-end').slideUp();
    }

    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        itineraryMinimized ? $('#do-dijkstra').slideDown() : $('#do-dijkstra').slideUp();
    }

    itineraryMinimized = !itineraryMinimized;
}