
function initializeMap() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(52.22207512938468, 21.006942987442017)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, 'click', function (e) {
        var firstId = findNotAddedOrderId();
        reverseGeocoding(e.latLng, updateOrderMarker, null, { id: firstId });
    });

    google.maps.event.addListener(map, 'rightclick', function (e) {
        if(!computing)
            reverseGeocoding(e.latLng, updateDepotMarker, removeDepotMarker);
    });
}

function showDepotInfoWindow() {
    if (depotMarker != null) {
        depotInfoWindow.open(map, depotMarker);
        map.panTo(depotMarker.getPosition());
    }
}

function showOrderInfoWindow(orderId) {
    var marker = findMarker(orderId);
    var selector = "[id='orders[" + orderId + "].address']";
    var address = $(selector).val();
    orderInfoWindow.setContent(address);
    orderInfoWindow.open(map, marker);
    map.panTo(marker.getPosition());
}