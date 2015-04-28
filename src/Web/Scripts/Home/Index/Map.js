
function initializeMap() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(52.22207512938468, 21.006942987442017)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, 'click', function (e) {
        var firstId = $("#orders").children().first().attr("id");
        reverseGeocoding(e.latLng, addOrderHandler, { Id: firstId });
    });

    google.maps.event.addListener(map, 'rightclick', function (e) {
        removeDepotMarker();
        reverseGeocoding(e.latLng, createDepot);
    });
}