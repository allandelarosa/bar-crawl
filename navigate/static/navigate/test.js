let service;
let location_data;
let markers = {};

function initMap() {
  // Create the map.
  const pyrmont = { lat: -33.866, lng: 151.196 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 17,
  });
  // Create the places service.
  service = new google.maps.places.PlacesService(map);

  // Perform a nearby search.
  service.nearbySearch(
    { location: pyrmont, radius: 500, type: "store" },
    (results, status) => {
      if (status !== "OK") return;
      console.log(results);
      createMarkers(results, map);
      location_data = []
      for (let data of results) {
        location_data.push({ "name": data.name, "lat": data.geometry.location.lat(), "lng": data.geometry.location.lng() })
      }

      // console.log(location_data)

      // NEW CALL TO DJIKSTRA
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

      const request = new Request(
        "/djikstra", {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(location_data),
      }
      );

      // console.log(request)

      // fetch(request)
      //   .then(response => response.json())
      //   .then(function (data) {
      //     let answer = data
      //     // console.log(answer)
      //     for (let point of answer.path) {
      //       let marker = new google.maps.Marker({
      //         map: map,
      //         position: point
      //       });
      //     }
      //     let flightPlanCoordinates = answer.path
      //     let flightPath = new google.maps.Polyline({
      //       path: flightPlanCoordinates,
      //       geodesic: true,
      //       strokeColor: '#FF0000',
      //       strokeOpacity: 1.0,
      //       strokeWeight: 2
      //     });

      //     flightPath.setMap(map)
      //   });
    }
  );
}

function createMarkers(places, map) {
  const bounds = new google.maps.LatLngBounds();
  const placesList = document.getElementById("search-results");

  labelIndex = 1;
  for (let i = 0, place; (place = places[i]); i++) {
    const defaultMarker = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 15,
      strokeColor: '#000000',
      strokeWeight: 2,
      fillColor: '#FF3333',
      fillOpacity: 1,
    };
    let marker = new google.maps.Marker({
      map: map,
      icon: defaultMarker,
      title: place.name,
      position: place.geometry.location,
      label: { text: "" + labelIndex, color: '#FFFFFF' },
      zIndex: -(labelIndex++),
    });
    markers[place.place_id] = marker

    placesList.appendChild(createSearchResult(place));

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}

function createSearchResult(place) {
  let li = document.createElement("li");

  let infoContainer = document.createElement('div');
  let photoContainer = document.createElement('div');

  photoContainer.classList.add('photo-container');
  infoContainer.classList.add('info-container');

  infoContainer.innerHTML = '<strong>' + place.name + '</strong><br>'

  if (place.rating) {
    infoContainer.innerHTML += 'Rating: ' + place.rating + ' (' + place.user_ratings_total + ')<br>'
  }

  infoContainer.innerHTML += place.vicinity + '<br>'

  if (place.opening_hours) {
    if (place.opening_hours.isOpen()) {
      infoContainer.innerHTML += 'Open now <br>'
    } else {
      infoContainer.innerHTML += 'Closed <br>'
    }
  }

  if (place.photos != null) {
    let photo = document.createElement('img');
    let firstPhoto = place.photos[0];
    photo.classList.add('result-photo');
    photo.src = firstPhoto.getUrl();
    photoContainer.appendChild(photo)
  }

  li.appendChild(photoContainer);
  li.appendChild(infoContainer);

  // li.id = place.place_id;

  li.addEventListener("mouseover", () => {
    let icon = markers[place.place_id].icon;
    icon.fillColor = '#FFDD33';
    markers[place.place_id].setIcon(icon);
    markers[place.place_id].zIndex += 30;
  });

  li.addEventListener("mouseout", () => {
    let icon = markers[place.place_id].icon;
    icon.fillColor = '#FF3333';
    markers[place.place_id].setIcon(icon);
    markers[place.place_id].zIndex -= 30;
  });

  return li
}
