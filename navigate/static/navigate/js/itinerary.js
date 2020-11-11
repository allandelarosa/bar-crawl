let itineraryVisible = false;

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
    $('#itinerary-control').fadeIn(500);
}

function hideItinerary() {
    itineraryVisible = false;
    $('#itinerary-control').fadeOut(500);
}

function showItineraryEntry(addingTo, place) {
    $('#itinerary-' + addingTo).append(
        $('<button>').addClass('remove-button').click(() => {
            removeItineraryEntry(addingTo);
        }).append('Remove'),
        '<div>' + (addingTo === 'start' ? 'Start: ' : 'End: ') + place.name + '</div>',
    ).fadeIn(500);
}

function removeItineraryEntry(addingTo) {
    return
}