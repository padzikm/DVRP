
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

    $("#depot\\.address").val(address);
    var lat = latLng.lat();
    var lng = latLng.lng();
    $("[name='depot.coords.lat']").val(lat);
    $("[name='depot.coords.lng']").val(lng);
    $("#showDepotBtn").prop("disabled", false);
}

function removeDepotMarker() {
    if (depotMarker != null) {
        depotMarker.setMap(null);
        google.maps.event.clearInstanceListeners(depotMarker);
        depotMarker = null;
    }
    $("[name='depot.coords.lat']").val("");
    $("[name='depot.coords.lng']").val("");
    $("#depot\\.address").val("");
    $("#showDepotBtn").prop("disabled", true);
}

function updateDepotMarker(latLng, address) {
    removeDepotMarker();
    createDepotMarker(latLng, address);
}

function removeDepot() {
    removeDepotMarker();
    $("#depot input").val("");
}

function insertDepot(json) {
    var lat = json["depot.coords.lat"];
    var lng = json["depot.coords.lng"];
    var address = json["depot.address"];
    var truckCount = json["depot.truckCount"];
    var truckLoad = json["depot.truckLoad"];
    var openTime = json["depot.openTime"];
    var closeTime = json["depot.closeTime"];
    var latLng = new google.maps.LatLng(lat, lng);

    updateDepotMarker(latLng, address);
    $("#depot\\.truckCount").val(truckCount);
    $("#depot\\.truckLoad").val(truckLoad);
    $("#depot\\.openTime").val(openTime);
    $("#depot\\.closeTime").val(closeTime);
}
