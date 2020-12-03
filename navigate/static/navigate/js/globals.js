const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// for map element
let map;
let bounds;
let service;
let geocoder;

// for markers and search results
let markers;
let infoWindows;
let expanded;

// for djikstra
let location_data;
let toVisit;

let startPoint;
let endPoint;

let itineraryControlVisible = false;
let itineraryControlMinimized = false;

let itineraryCreated;

let graph;
let path;