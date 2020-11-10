function initMap() {
    const input = document.getElementById("address");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
        window.location.href = "/hop/" + input.value;
    });
}


// let background_div = document.createElement('div');
// var elem = document.createElement("img");
// elem.src = "/static/navigate/images/barpic.jpeg";
// // document.getElementById("placehere").appendChild(elem);
// background_div.appendChild(elem)
// background_div.classList.add('barpic_background')

