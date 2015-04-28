
function findMarker(id) {
    var marker;
    for (var i = 0, len = orderMarkers.length; i < len; ++i)
        if (parseInt(orderMarkers[i].orderId) === parseInt(id)) {
            marker = orderMarkers[i];
            break;
        }

    return marker;
}
