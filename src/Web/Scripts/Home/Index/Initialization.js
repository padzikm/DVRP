
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
    }, timeout*1000);
}

function sendOrders() {
    if (!computing)
        return;
    var jq = $();
    var min = currentMinute;
    var h = currentHour;
    $("#orders tr:gt(1):not(.sent)").each(function (index, val) {
        var $val = $(val);
        if ($val.find("[id$='address']").val() === "")
            return;
        var time = $val.find("[id$='Time']").val();
        var separator = time.indexOf(":");
        var hour = parseInt(time.substring(0, separator));
        var minute = parseInt(time.substring(separator + 1));
        if ((hour > h) || (hour === h && minute > min))
            return;
        var inputs = $val.find("input");
        $.merge(jq, inputs);
        $val.addClass("sent");
        $val.find("button[name^='delete']").prop("disabled", true);
    });
    if (jq.length === 0)
        return;
    var obj = serializeObj(jq);
    jq.prop("disabled", true);
    sendPostAjax(obj, "/Home/AddOrders");
}