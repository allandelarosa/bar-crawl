function createItineraryControl() {
    return $('#itinerary-control').append(
        // title bar
        $('<div>').append(
            $('<strong>').text('Selected Bars'),
        ),

        // start and end entries
        $('<div>').attr('id','itinerary-start').addClass('itinerary-control-entry'),
        $('<div>').attr('id','itinerary-end').addClass('itinerary-control-entry'),

        // dijkstra button
        $('<button>').attr('id','do-dijkstra').text('Create Itinerary').click(() => {
            doDijkstra();
        }),
    )[0];
}

function updateItinerary(place, addingTo) {
    let itinerary = document.getElementById('itinerary');
    if (!itineraryVisible) {
        showItinerary(itinerary);
    }

    if (addingTo === 'start') {
        showItineraryEntry(addingTo, place);
    }

    if (addingTo === 'end') {
        showItineraryEntry(addingTo, place);
    }
}

function showItinerary(itinerary) {
    itineraryVisible = true;
    $('#itinerary-control').fadeIn();
}

function hideItinerary() {
    itineraryVisible = false;
    $('#itinerary-control').fadeOut();
}

function clearItinerary() {
    removeItineraryEntry('start');
    removeItineraryEntry('end');
}

function showItineraryEntry(addingTo, place) {
    $('#itinerary-' + addingTo).empty().append(
        $('<button>').addClass('remove-button').click(() => {
            removeItineraryEntry(addingTo);
        }).append('Remove'),
        $('<div>').append((addingTo === 'start' ? 'Start: ' : 'End: ') + place.name).click(() => {
            scrollResults(place)
        }).hover(
            () => { highlightMarker(markers[place.place_id]) },
            () => { unhighlightMarker(markers[place.place_id]) },
        )
    ).fadeIn();
}

function removeItineraryEntry(addingTo) {
    $('#itinerary-' + addingTo).empty().fadeOut();

    if (addingTo === 'start') {
        startPoint = {};
    } else {
        endPoint = {};
    }

    $('#do-dijkstra').fadeOut();

    if ($.isEmptyObject(startPoint) && $.isEmptyObject(endPoint)) {
        hideItinerary();
    }
}

function replaceItineraryEntry(first, second, place) {
    $('#itinerary-' + first).empty().hide();
    $('#itinerary-' + second).empty().append(
        $('<button>').addClass('remove-button').click(() => {
            removeItineraryEntry(second);
        }).append('Remove'),
        $('<div>').append((second === 'start' ? 'Start: ' : 'End: ') + place.name).click(() => {
            scrollResults(place)
        }).hover(
            () => { highlightMarker(markers[place.place_id]) },
            () => { unhighlightMarker(markers[place.place_id]) },
        )
    ).show();
}