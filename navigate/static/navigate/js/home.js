function initMap() {
    const input = document.getElementById("address");
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
        window.location.href = "/crawl/" + input.value;
    });

    $('#search-button').click(() => {
    	window.location.href = "/crawl/" + input.value;
    });

    $('#steps').click(() => {
    	$('.bgimg-3')[0].scrollIntoView({behavior: 'smooth', block: 'center'});
    });

    $('#aboutus').click(() => {
    	$('.bgimg-4')[0].scrollIntoView({behavior: 'smooth', block: 'center'});
    });
}