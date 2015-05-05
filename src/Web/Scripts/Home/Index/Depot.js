
function createDepotMarker(latLng, address) {
    depotInfoWindow.setContent(address);

    depotMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Depot',
        icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    });

    google.maps.event.addListener(depotMarker, 'click', function (e) {
        showDepotInfoWindow();
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

    if (address === "")
        return;

    var latLng = new google.maps.LatLng(lat, lng);

    updateDepotMarker(latLng, address);
    $("#depot\\.truckCount").val(truckCount);
    $("#depot\\.truckLoad").val(truckLoad);
    $("#depot\\.openTime").val(openTime);
    $("#depot\\.closeTime").val(closeTime);
}

function validateDepot() {
    var address = $("[id='depot.address']").val();
    var truckCount = $("[id='depot.truckCount']").val();
    var truckCountVal = parseInt(truckCount);
    var truckLoad = $("[id='depot.truckLoad']").val();
    var truckLoadVal = parseInt(truckLoad);

    return validateDepotTime() && address !== "" && !isNaN(truckCountVal) && truckCountVal > 0 && !isNaN(truckLoadVal) && truckLoadVal > 0;
}

function validateDepotTime() {
    var depotOpenTime = $("[id='depot.openTime']").val();
    var separator = depotOpenTime.indexOf(":");
    var depotOpenHour = parseInt(depotOpenTime.substring(0, separator));
    var depotOpenMinute = parseInt(depotOpenTime.substring(separator + 1));

    var depotCloseTime = $("[id='depot.closeTime']").val();
    separator = depotCloseTime.indexOf(":");
    var depotCloseHour = parseInt(depotCloseTime.substring(0, separator));
    var depotCloseMinute = parseInt(depotCloseTime.substring(separator + 1));

    if ((depotOpenHour > depotCloseHour) || (depotOpenHour === depotCloseHour && depotOpenMinute > depotCloseMinute))
        return false;

    return true;
}