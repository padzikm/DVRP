
$(function () {
    initializeMap();
    setEvents();
    setTimeOptions();
    setTimeFunc();
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
        console.log(time);
        $("#currentTime").val(time);
    }, timeout*1000);
}