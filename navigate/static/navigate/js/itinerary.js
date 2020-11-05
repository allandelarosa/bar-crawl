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

    dijkstraButton.addEventListener('click', () => {
        doDjikstra();
    })
}

function showItineraryEntry(addingTo, place) {
    let ele = document.getElementById('itinerary-' + addingTo);

    let placeInfo;

    if (addingTo === 'start' && !$.isEmptyObject(startPoint)) {
        placeInfo = ele.getElementsByTagName('DIV')[0];
        placeInfo.innerHTML = 'Start: ' + place.name;

    } else if (addingTo === 'end' && !$.isEmptyObject(endPoint)) {
        let placeInfo = ele.getElementsByTagName('DIV')[0];
        placeInfo.innerHTML = 'End: ' + place.name;

    } else {
        // add button to remove entry
        let removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerHTML = 'Remove';

        removeButton.addEventListener('click', () => {
            removeItineraryEntry(addingTo);
        });

        // add text for place info
        placeInfo = document.createElement('div');
        if (addingTo === 'start') {
            placeInfo.innerHTML = 'Start: ' + place.name;
        } else {
            placeInfo.innerHTML = 'End: ' + place.name;
        }

        ele.appendChild(removeButton);
        ele.appendChild(placeInfo);
    }

    placeInfo.addEventListener('click', () => {
        scrollResults(place);
    })
    updateToVisit(place, addingTo);
}

function removeItineraryEntry(addingTo) {
    let ele = document.getElementById('itinerary-' + addingTo);

    while (ele.lastChild) {
        ele.removeChild(ele.lastChild);
    }

    if (addingTo === 'start') {
        startPoint = {};
    } else {
        endPoint = {};
    }

    if ($.isEmptyObject(startPoint) || $.isEmptyObject(endPoint)) {
        document.getElementById('do-dijkstra').disabled = true;
    }

    if ($.isEmptyObject(startPoint) && $.isEmptyObject(endPoint)) {
        hideItinerary();
    }
}

function hideItinerary() {
    itineraryVisible = false;

    // hide itinerary
    let itinerary = document.getElementById('itinerary');
    while (itinerary.lastChild) {
        itinerary.removeChild(itinerary.lastChild)
    }
    itinerary.style.height = 0;

    // resze search results
    let searchResults = document.getElementById('search-results');

    searchResults.style.height = '100%';
}