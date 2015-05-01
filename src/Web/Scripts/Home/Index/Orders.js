﻿
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
        $("#" + marker.orderId).remove();
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
    var lat = latLng.lat();
    var lng = latLng.lng();
    $(thisId).find("input[name$='address']").val(address);
    $(thisId).find("input[type='hidden'][name$='lat']").val(lat);
    $(thisId).find("input[type='hidden'][name$='lng']").val(lng);
    $(thisId).find("button").prop("disabled", false);
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
    var str = '<tr id="' + nextId + '"><input type="hidden" name="orders.Index" value="' + nextId + '" style="display: none;"/>';
    str += '<td style="display: none"><input type="hidden" name="orders[' + nextId + '].coords.lat" value="0"/></td>';
    str += '<td style="display: none"><input type="hidden" name="orders[' + nextId + '].coords.lng" value="0" /></td>';
    str += '<td><input id="orders[' + nextId + '].name" name="orders[' + nextId + '].name" type="text" /></td>';
    str += '<td><input id="orders[' + nextId + '].address" name="orders[' + nextId + '].address" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].amount" name="orders[' + nextId + '].amount" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].openHour" name="orders[' + nextId + '].openHour" type="text" /></td>';
    str += '<td><input id="orders[' + nextId + '].closeHour" name="orders[' + nextId + '].closeHour" type="text" /></td>';
    str += '<td><button name="showOrderBtn" disabled="disabled" data-id="' + nextId + '">Show</button></td>';
    str += '<td><button name="deleteOrderBtn" disabled="disabled" data-id="' + nextId + '">Delete</button></td></tr>';
    $(str).prependTo("#orders table > tbody");
}

function insertOrders(json) {
    var ordersIndex = json["orders.Index"];

    for (var index in ordersIndex) {
        if (ordersIndex.hasOwnProperty(index)) {
            var lat = json["orders[" + index + "].coords.lat"];
            var lng = json["orders[" + index + "].coords.lng"];
            var address = json["orders[" + index + "].address"];
            var name = json["orders[" + index + "].name"];
            var amount = json["orders[" + index + "].amount"];
            var openHour = json["orders[" + index + "].openHour"];
            var closeHour = json["orders[" + index + "].closeHour"];

            if (address === "")
                continue;

            var firstId = findNotAddedOrderId();
            var selector = "[id='orders[" + firstId + "]";

            $(selector + ".name']").val(name);
            $(selector + ".amount']").val(amount);
            $(selector + ".openHour']").val(openHour);
            $(selector + ".closeHour']").val(closeHour);

            var latLng = new google.maps.LatLng(lat, lng);

            addOrderHandler(latLng, address, { Id: firstId });
        }
    }
}
