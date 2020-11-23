// custom popup to get rid of x button
async function createInfoWindow(position, place) {
    class Popup extends google.maps.OverlayView {
        constructor(position, content) {
            super();
            this.position = position;
            content.classList.add("popup-bubble");
            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");
            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.appendChild(content);
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            // Optionally stop clicks, etc., from bubbling up to the map.
            // Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        }

        /** Called when the popup is added to the map. */
        onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
        }

        /** Called when the popup is removed from the map. */
        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }

        /** Called each frame when the popup needs to draw itself. */
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position
            );
            
            this.containerDiv.style.left = divPosition.x + "px";
            this.containerDiv.style.top = divPosition.y + "px";
        }

        hide() {
            if (this.containerDiv) {
                this.containerDiv.style.visibility = "hidden";
            }
        }

        show() {
            if (this.containerDiv) {
                this.containerDiv.style.visibility = "visible";
            }
        }
    }

    return new Popup(
        position,
        infoWindowContent(place)
    );
}

function infoWindowContent(place) {
    return $('<div>').addClass('info-window').append(
        // picture
        place.photos ? $('<div>').append(
            $('<img>').addClass('result-photo').attr('src', place.photos[0].getUrl())
        ).addClass('photo-container') : $(),

        // name
        $('<div>').append(
            $('<strong>').text(place.name).addClass('place-name'),
        ),

        // ratings
        place.rating ? $('<div>').append(
            // rating number
            $('<div>').text(`${place.rating} `).css('color', ' #fb0'),
            // star rating
            $('<div>').addClass('Stars').css('--rating', `${place.rating}`),
            // number of ratings
            $('<div>').text(`(${place.user_ratings_total})`).css('color', ' #ccc'),
        ).addClass('ratings-container') : $(),

        // price level and address
        $('<div>').html(() => {
            let info = ''
            // get price level
            if (place.price_level) {
                let price_level = place.price_level;
                while (price_level-- > 0) info += '$';

                info += ' &#183; ';
            }

            // get address
            info += place.vicinity.split(',')[0];

            return info;
        }).css('color', '#555'),
    )[0];
}

async function clearInfoWindows() {
    if (!infoWindows) return;

    for (let window of infoWindows) {
        window.setMap(null);
    }
}