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
        '<div>' + (addingTo === 'start' ? 'Start: ' : 'End: ') + place.name + '</div>',
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
        '<div>' + (second === 'start' ? 'Start: ' : 'End: ') + place.name + '</div>',
    ).show();
}