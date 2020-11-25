function dijkstraItineraryControl() {
    $('#itinerary-control').empty().off().append(
        // title bar
        $('<div>').addClass('itinerary-control-title').append(
            $('<div>').text('Selected Bars'),
            $('<button>').addClass('btn btn-outline-light').attr('id', 'minimize-button').append(
                $('<i>').addClass('fa fa-compress'),
            ).click((event) => {
                event.stopPropagation();
                minimizeItineraryControl();
            }),
        ).click(() => {
            minimizeItineraryControl();
        }),

        // start and end entries
        $('<div>').addClass('itinerary-control-entries').append(
            $('<div>').attr('id', 'itinerary-start').append(
                $('<button>').addClass('btn btn-danger remove-button').append(
                    $('<i>').addClass('fa fa-minus'),
                ).click(() => {
                    removeItineraryControlEntry('start');
                }),
            ),

            $('<div>').attr('id', 'itinerary-end').append(
                $('<button>').addClass('btn btn-danger remove-button').append(
                    $('<i>').addClass('fa fa-minus'),
                ).click(() => {
                    removeItineraryControlEntry('end');
                }),
            ),
        ),

        // dijkstra button
        $('<div>').addClass('dijkstra-container').append(
            $('<button>').addClass('btn btn-primary btn-sm').attr('id', 'do-dijkstra').text('Create Itinerary'),
        ),
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

    $('.dijkstra-container').fadeOut();

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

    $('.dijkstra-container').fadeOut();
}

async function minimizeItineraryControl() {
    $('#minimize-button i').toggleClass('fa-compress fa-expand');

    // $('.itinerary-control-title').toggleClass('control-expanded');

    itineraryControlMinimized ? $('.itinerary-control-entries').slideDown() : $('.itinerary-control-entries').slideUp();

    if (!$.isEmptyObject(startPoint) && !$.isEmptyObject(endPoint)) {
        itineraryControlMinimized ? $('.dijkstra-container').slideDown() : $('.dijkstra-container').slideUp();
    }

    itineraryControlMinimized = !itineraryControlMinimized;
}

async function searchResetControl(places) {
    $('#itinerary-control').off().empty().append(
        $('<button>').addClass('btn btn-dark reset-btn').click(() => {
            path.setMap(null);
            
            $('#itinerary-control').hide();

            dijkstraItineraryControl();
            $('#do-dijkstra').off().click(() => {
                doDijkstra(places);
            });
            clearItineraryControl();

            itineraryCreated = false;

            startPoint = {};
            endPoint = {};

            hideMarkers();

            resetMarkers(places);
            createSearchResults(places);

            expanded = "";
        }).text('Back to Search')
    ).fadeIn();
}