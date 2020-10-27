const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// for map element
let map;
let bounds;
let service;
let infoWindow;
let currentInfoWindow;

// for markers and search results
let markers = {};
let placesList = document.getElementById("search-results");

// for djikstra
let location_data;
let toVisit;

let djikstraButton = document.getElementById('doDjikstra');
djikstraButton.addEventListener("click", () => {
    doDjikstra();
})

let graph;
let path;