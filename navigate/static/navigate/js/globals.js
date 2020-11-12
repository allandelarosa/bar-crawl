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

let expanded;

// for djikstra
let location_data;
let toVisit;

let startPoint;
let endPoint;

let itineraryVisible = false;

let graph;
let path;