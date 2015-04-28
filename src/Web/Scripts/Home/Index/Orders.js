
function createOrderMarker(latLng, address) {
    var infowindow = new google.maps.InfoWindow({
        content: address
    });
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Order',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        draggable: true,
        infoWindow: infowindow
    });

    google.maps.event.addListener(marker, 'click', function (e) {
        var id = "#name_" + marker.orderId;
        $(id).focus();
    });
    google.maps.event.addListener(marker, 'rightclick', function (e) {
        removeOrderMarker(marker);
    });
    google.maps.event.addListener(marker, 'dragstart', function (e) {
        infowindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', function (e) {
        reverseGeocoding(e.latLng, function (latLng, address) {
            var divId = "#" + marker.orderId;
            $(divId).find("input[name^='address_']").val(address);
        });
    });

    return marker;
}

function createOrder(latLng, address, data) {
    var marker = createOrderMarker(latLng, address);
    marker.orderId = data.Id;
    orderMarkers.push(marker);
    var divId = "#" + data.Id;
    $(divId).find("input[name^='address_']").val(address);
    $(divId).find("button").prop("disabled", false);
}

function removeOrderMarker(marker) {
    var index = orderMarkers.indexOf(marker);
    orderMarkers.splice(index, 1);
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
}

function addOrderHandler(latLng, address, data) {
    createOrder(latLng, address, data);
    ++nextId;
    var str = '<div id="' + nextId + '"><br/><label for="name_' + nextId + '">Name: </label><input id="name_' + nextId + '" name="name_' + nextId + '" type="text" /><br /><br />';
    str += '<label for="address_' + nextId + '">Address: </label><input id="address_' + nextId + '" name="address_' + nextId + '" type="text"/><br/><br/>';
    str += '<label for="orderAmount_' + nextId + '">Amount: </label><input id="orderAmount_' + nextId + '" name="orderAmount_' + nextId + '" type="text"/>';
    str += '<br/><br/><button name="showOrderBtn" disabled="disabled" data-id="' + nextId + '">Show on map</button> <button name="deleteOrderBtn" disabled="disabled" data-id="' + nextId + '">Delete</button><br/><br/></div>';
    $("#orders").prepend(str);
}
