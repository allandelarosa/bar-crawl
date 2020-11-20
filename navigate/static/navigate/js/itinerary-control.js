function dijkstraItineraryControl() {
    return $('#itinerary-control').empty().append(
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
        $('<div>').attr('id', 'itinerary-start').addClass('itinerary-control-entry').append(
            $('<button>').addClass('btn btn-danger remove-button').append(
                $('<i>').addClass('fa fa-minus'),
            ).click(() => {
                removeItineraryControlEntry('start');
            }),
        ),

        $('<div>').attr('id', 'itinerary-end').addClass('itinerary-control-entry').append(
            $('<button>').addClass('btn btn-danger remove-button').append(
                $('<i>').addClass('fa fa-minus'),
            ).click(() => {
                removeItineraryControlEntry('end');
            }),
        ),

        // dijkstra button
        $('<button>').addClass('btn btn-primary').attr('id', 'do-dijkstra').text('Create Itinerary'),
    )[0];
}

function updateItineraryControl(place, addingTo) {
    if (!itineraryControlVisible) {
        itineraryControlVisible = true;
        $('#itinerary-control').fadeIn();
    }

    if (addingTo === 'start') {
        showItineraryControlEntry(addingTo, place);
    }

    if (addingTo === 'end') {
        showItineraryControlEntry(addingTo, place);
    }
}

async function clearItineraryControl() {
    removeItineraryControlEntry('start');
    removeItineraryControlEntry('end');
}

function showItineraryControlEntry(addingTo, place) {
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

function removeItineraryControlEntry(addingTo) {
    $(`#itinerary-${addingTo}`).fadeOut();

    if (addingTo === 'start') {
        startPoint = {};
    } else {
        endPoint = {};
    }

    $('#do-dijkstra').fadeOut();

    if ($.isEmptyObject(startPoint) && $.isEmptyObject(endPoint)) {
        itineraryControlVisible = false;
        $('#itinerary-control').fadeOut();
    }
}

function replaceItineraryControlEntry(first, second, place) {
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
        itineraryControlMinimized ? $('#itinerary-start').slideDown() : $('#itinerary-start').slideUp();
    }

    if (!$.isEmptyObject(endPoint)) {
        itineraryControlMinimized ? $('#itinerary-end').slideDown() : $('#itinerary-end').slideUp();
    }

    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        itineraryControlMinimized ? $('#do-dijkstra').slideDown() : $('#do-dijkstra').slideUp();
    }

    itineraryControlMinimized = !itineraryControlMinimized;
}

function searchResetControl() {
    $('#itinerary-control').empty().append(
        $('<button>').addClass('btn btn-dark').click(() => {

        }).text('Back to Search')
    );
}