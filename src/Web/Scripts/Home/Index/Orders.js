
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
        var thisId = "#" + marker.orderId;
        $(thisId).find("input[name$='name']").focus();
    });
    google.maps.event.addListener(marker, 'rightclick', function (e) {
        removeOrderMarker(marker);
    });
    google.maps.event.addListener(marker, 'dragstart', function (e) {
        infowindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', function (e) {
        reverseGeocoding(e.latLng, function (latLng, address) {
            var thisId = "#" + marker.orderId;
            $(thisId).find("input[name$='address']").val(address);
        });
    });

    return marker;
}

function createOrder(latLng, address, data) {
    var marker = createOrderMarker(latLng, address);
    marker.orderId = data.Id;
    orderMarkers.push(marker);
    var thisId = "#" + data.Id;
    $(thisId).find("input[name$='address']").val(address);
    $(thisId).find("button").prop("disabled", false);
}

function removeOrderMarker(marker) {
    var thisId = "#" + marker.orderId;
    var index = orderMarkers.indexOf(marker);
    orderMarkers.splice(index, 1);
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    $(thisId).remove();
}

function addOrderHandler(latLng, address, data) {
    createOrder(latLng, address, data);
    ++nextId;
    var str = '<tr id="' + nextId + '"><input type="hidden" name="orders.Index" value="' + nextId + '" style="display: none;"/>';
    str += '<td><input id="orders[' + nextId + '].name" name="orders[' + nextId + '].name" type="text" /></td>';
    str += '<td><input id="orders[' + nextId + '].address" name="orders[' + nextId + '].address" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].amount" name="orders[' + nextId + '].amount" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].openHour" name="orders[' + nextId + '].openHour" type="text" /></td>';
    str += '<td><input id="orders[' + nextId + '].closeHour" name="orders[' + nextId + '].closeHour" type="text" /></td>';
    str += '<td><button name="showOrderBtn" disabled="disabled" data-id="' + nextId + '">Show</button></td>';
    str += '<td><button name="deleteOrderBtn" disabled="disabled" data-id="' + nextId + '">Delete</button></td></tr>';
    $(str).prependTo("#orders table > tbody");
}
