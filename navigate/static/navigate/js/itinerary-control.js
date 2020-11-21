function dijkstraItineraryControl() {
    $('#itinerary-control').empty().off().append(
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
    );
}

async function updateItineraryControl(place, addingTo) {
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

async function showItineraryControlEntry(addingTo, place) {
    $(`#itinerary-${addingTo} div`).remove();

    $(`#itinerary-${addingTo}`).off().append(
        $('<div>').text(
            `${addingTo === 'start' ? 'Start' : 'End'}: ${place.name}`
        ).addClass('place-name').click(() => {
            scrollResults(place.place_id);
        }).hover(
            () => { highlightMarker(markers[place.place_id]) },
            () => { unhighlightMarker(markers[place.place_id]) },
        ),
    );

    $(`#itinerary-${addingTo}`).fadeIn();
}

async function removeItineraryControlEntry(addingTo) {
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

async function replaceItineraryControlEntry(first, second, place) {
    $(`#itinerary-${first}`).hide();

    $(`#itinerary-${second} div`).remove();

    $(`#itinerary-${second}`).off().append(
        $('<div>').text(
            `${second === 'start' ? 'Start' : 'End'}: ${place.name}`
        ).addClass('place-name').click(() => {
            scrollResults(place.place_id);
        }).hover(
            () => { highlightMarker(markers[place.place_id]) },
            () => { unhighlightMarker(markers[place.place_id]) },
        ),
    );
    $(`#itinerary-${second}`).show();

    $('#do-dijkstra').fadeOut();
}

async function minimizeItineraryControl() {
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

async function searchResetControl(places) {
    $('#itinerary-control').empty().off().append(
        $('<button>').addClass('btn btn-dark reset-btn').click(() => {
            path.setMap(null);
            
            $('#itinerary-control').hide();

            dijkstraItineraryControl();
            $('#do-dijkstra').off().click(() => {
                doDijkstra(places);
            });
            clearItineraryControl();

            startPoint = {};
            endPoint = {};

            hideMarkers();

            resetMarkers(places);
            createSearchResults(places);

            expanded = "";
        }).text('Back to Search')
    );
}