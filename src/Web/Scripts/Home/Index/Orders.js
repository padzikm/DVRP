
function createOrderMarker(latLng, address, data) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Order',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        draggable: true,
        orderId: data.id
    });

    google.maps.event.addListener(marker, 'click', function (e) {
        showOrderInfoWindow(marker.orderId);
        var selector = "#" + marker.orderId + " [id$='name']";
        $(selector).focus();
    });
    google.maps.event.addListener(marker, 'rightclick', function (e) {
        if (!computing)
            removeOrder(marker.orderId);
    });
    google.maps.event.addListener(marker, 'dragstart', function (e) {
        orderInfoWindow.close();
    });
    google.maps.event.addListener(marker, 'dragend', function (e) {
        reverseGeocoding(e.latLng, function (latLng, address) {
            var thisId = "#" + marker.orderId;
            $(thisId).find("input[name$='address']").val(address);
        });
    });

    orderMarkers.push(marker);
    var thisId = "#" + data.id;
    var lat = latLng.lat();
    var lng = latLng.lng();
    $(thisId).find("input[name$='address']").val(address);
    $(thisId).find("input[type='hidden'][name$='lat']").val(lat);
    $(thisId).find("input[type='hidden'][name$='lng']").val(lng);
    $(thisId).find("button[name^='show']").prop("disabled", false);
}

function removeOrderMarker(orderId) {
    var selector = "#" + orderId;
    var marker = findMarker(orderId);
    if (marker != null) {
        var index = orderMarkers.indexOf(marker);
        orderMarkers.splice(index, 1);
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
    }

    $(selector).find("input[name$='address']").val("");
    $(selector).find("input[type='hidden'][name$='lat']").val("");
    $(selector).find("input[type='hidden'][name$='lng']").val("");
    $(selector).find("[name='showOrderBtn']").prop("disabled", true);
}

function updateOrderMarker(latLng, address, data) {
    removeOrderMarker(data.id);
    createOrderMarker(latLng, address, data);
}

function removeOrder(orderId) {
    var selector = "#" + orderId;
    removeOrderMarker(orderId);
    $(selector).remove();
}

function addOrderHandler(latLng, address, data) {
    var marker = findMarker(data.id);
    if (marker == null)
        createOrderMarker(latLng, address, data);
    else if (data.force)
        updateOrderMarker(latLng, address, data);
    var thisId = "#" + data.id;
    $(thisId).find("button").prop("disabled", false);
    ++nextId;
    var str = '<tr id="' + nextId + '"><td class="no-display"><input type="hidden" name="orders.index" value="' + nextId + '" style="display: none;"/></td>';
    str += '<td class="no-display"><input type="hidden" name="orders[' + nextId + '].coords.lat" value="0"/></td>';
    str += '<td class="no-display"><input type="hidden" name="orders[' + nextId + '].coords.lng" value="0" /></td>';
    str += '<td><input id="orders[' + nextId + '].name" name="orders[' + nextId + '].name" type="text" /></td>';
    str += '<td><input id="orders[' + nextId + '].address" name="orders[' + nextId + '].address" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].amount" name="orders[' + nextId + '].amount" type="text"/></td>';
    str += '<td><input id="orders[' + nextId + '].openTime" name="orders[' + nextId + '].openTime" type="text" /></td>';
    str += '<td><button name="showOrderBtn" disabled="disabled" data-id="' + nextId + '">Show</button></td>';
    str += '<td><button name="deleteOrderBtn" disabled="disabled" data-id="' + nextId + '">Delete</button></td></tr>';
    $(str).prependTo("#orders table > tbody");

    var selector = "[id='orders[" + nextId + "].openTime']";
    $(selector).timepicker({
        minuteStep: 1,
        showMeridian: false
    });
}

function insertOrders(json) {
    var ordersIndex = json["orders.index"];

    for (var key in ordersIndex) {
        if (ordersIndex.hasOwnProperty(key)) {
            var index = ordersIndex[key];
            var lat = json["orders[" + index + "].coords.lat"];
            var lng = json["orders[" + index + "].coords.lng"];
            var address = json["orders[" + index + "].address"];
            var name = json["orders[" + index + "].name"];
            var amount = json["orders[" + index + "].amount"];
            var openTime = json["orders[" + index + "].openTime"];

            if (address === "")
                continue;

            var firstId = findNotAddedOrderId();
            var selector = "[id='orders[" + firstId + "]";

            $(selector + ".name']").val(name);
            $(selector + ".amount']").val(amount);
            $(selector + ".openTime']").val(openTime);

            var latLng = new google.maps.LatLng(lat, lng);

            addOrderHandler(latLng, address, { id: firstId, force: true });
        }
    }
}

function validateOrder(orderId, currentHour, currentMinute) {
    var selector = "[id='orders[" + orderId + "]";
    var address = $(selector + ".address']").val();
    var amount = $(selector + ".amount']").val();
    var amountVal = parseInt(amount);
    var openTime = $(selector + ".openTime']").val();

    var inputsValidation = address !== "" && !isNaN(amountVal) && amountVal > 0 && openTime !== "";

    if (!inputsValidation)
        return false;

    var separator = openTime.indexOf(":");
    var hour = parseInt(openTime.substring(0, separator));
    var minute = parseInt(openTime.substring(separator + 1));

    var timeValidation = validateOrderTime(currentHour, currentMinute, hour, minute);

    return timeValidation;
}

function validateOrderTime(currentHour, currentMinute, orderHour, orderMinute) {
    if ((currentHour < orderHour) || (currentHour === orderHour && orderMinute > currentMinute))
        return false;

    var depotOpenTime = $("[id='depot.openTime']").val();
    var separator = depotOpenTime.indexOf(":");
    var depotOpenHour = parseInt(depotOpenTime.substring(0, separator));
    var depotOpenMinute = parseInt(depotOpenTime.substring(separator + 1));
    
    if ((depotOpenHour > orderHour) || (depotOpenHour === orderHour && orderMinute < depotOpenMinute))
        return false;

    var depotCloseTime = $("[id='depot.closeTime']").val();
    separator = depotCloseTime.indexOf(":");
    var depotCloseHour = parseInt(depotCloseTime.substring(0, separator));
    var depotCloseMinute = parseInt(depotCloseTime.substring(separator + 1));
    
    if ((depotCloseHour < orderHour) || (depotCloseHour === orderHour && orderMinute > depotCloseMinute))
        return false;

    return true;
}