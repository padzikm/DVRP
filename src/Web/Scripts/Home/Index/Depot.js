
function createDepot(latLng, address, data) {
    removeDepotMarker();
    createDepotMarker(latLng, address);
    $("#depot\\.address").val(address);
    $("#showDepotBtn").prop("disabled", false);
}

function createDepotMarker(latLng, address) {
    var infowindow = new google.maps.InfoWindow({
        content: address
    });
    depotMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Depot',
        icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        infoWindow: infowindow
    });

    google.maps.event.addListener(depotMarker, 'click', function (e) {
        $("#depot.trackCount").focus();
    });
}

function removeDepotMarker() {
    if (depotMarker != null) {
        depotMarker.setMap(null);
        google.maps.event.clearInstanceListeners(depotMarker);
        depotMarker = null;
    }
}
