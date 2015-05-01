
function findMarker(id) {
    var marker = null;
    for (var i = 0, len = orderMarkers.length; i < len; ++i)
        if (parseInt(orderMarkers[i].orderId) === parseInt(id)) {
            marker = orderMarkers[i];
            break;
        }

    return marker;
}

function findNotAddedOrderId() {
    return $("#orders table > tbody > tr:first-child").attr("id");
}

function findInputOrderId(input) {
    return $(input).closest("tr").attr("id");
}