
$(function () {
    initializeMap();
    setEvents();
    setTimeOptions();
    setTimeFunc();
    depotInfoWindow = new google.maps.InfoWindow();
    orderInfoWindow = new google.maps.InfoWindow();
});

function setTimeOptions() {
    var date = new Date();
    currentHour = date.getHours();
    currentMinute = date.getMinutes();
    var time = currentHour + ":";
    if (currentMinute < 10)
        time += "0";
    time += currentMinute;
    $("#currentTime").val(time);
    $("#timeStep").val(timeStep);
    $("#timeStepVal").val("x " + timeStep);
}

function setTimeFunc() {
    setInterval(function () {
        if (!computing)
            return;
        currentMinute += timeStep;
        if (currentMinute >= 60) {
            ++currentHour;
            currentMinute = currentMinute % 60;
            if (currentHour >= 24)
                currentHour = 0;
        }
        var time = currentHour + ":";
        if (currentMinute < 10)
            time += "0";
        time += currentMinute;
        $("#currentTime").val(time);
        sendOrders();
    }, timeout * 1000);
}
