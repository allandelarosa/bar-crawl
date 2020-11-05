let itineraryVisible = false;

function updateItinerary(place, addingTo) {
    let itinerary = document.getElementById('itinerary');
    if (!itineraryVisible) {
        showItinerary(itinerary);
    }

    if (addingTo === 'start') {
        showItineraryEntry(addingTo, place.name);
    }

    if (addingTo === 'end') {
        showItineraryEntry(addingTo, place.name);
    }
}

function showItinerary(itinerary) {
    itineraryVisible = true;

    // make div visible
    let searchResults = document.getElementById('search-results');

    const itinHeight = 30;

    itinerary.style.height = '' + itinHeight + '%';
    searchResults.style.height = '' + (100 - itinHeight) + '%';

    // add title
    let itinTitle = document.createElement('div');
    itinTitle.innerHTML = 'Itinerary';
    itinerary.appendChild(itinTitle);

    // add start and end sections
    let start = document.createElement('div');
    let end = document.createElement('div');

    start.classList.add('itinerary-entry');
    end.classList.add('itinerary-entry');

    start.id = 'itinerary-start';
    end.id = 'itinerary-end';

    itinerary.appendChild(start);
    itinerary.appendChild(end);

    // make djikstra button
    let dijkstraButton = document.createElement('button');
    dijkstraButton.id = 'do-dijkstra';
    dijkstraButton.classList.add('btn', 'btn-dark');
    dijkstraButton.disabled = true;
    dijkstraButton.innerHTML = 'Create Itinerary'
    itinerary.appendChild(dijkstraButton);
}

function showItineraryEntry(addingTo, placeName) {
    let ele = document.getElementById('itinerary-' + addingTo);

    // add button to remove entry
    let removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    removeButton.innerHTML = 'Remove';

    removeButton.addEventListener('click', () => {
        removeItineraryEntry(ele);
    });

    // add text for place info
    let placeInfo = document.createElement('div');
    if (addingTo === 'start') {
        placeInfo.innerHTML = 'Start: ' + placeName;
    } else {
        placeInfo.innerHTML = 'End: ' + placeName;
    }
    
    ele.appendChild(removeButton);
    ele.appendChild(placeInfo);
}

function removeItineraryEntry(ele) {
    return;
}