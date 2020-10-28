function initMap() {
    const input = document.getElementById("address");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
        window.location.replace("/hop/" + input.value);
    });
}