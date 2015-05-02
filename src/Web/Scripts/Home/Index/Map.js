
function initializeMap() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(52.22207512938468, 21.006942987442017)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, 'click', function (e) {
        var firstId = findNotAddedOrderId();
        reverseGeocoding(e.latLng, addOrderHandler, null, { id: firstId });
    });

    google.maps.event.addListener(map, 'rightclick', function (e) {
        reverseGeocoding(e.latLng, updateDepotMarker, removeDepotMarker);
    });
}