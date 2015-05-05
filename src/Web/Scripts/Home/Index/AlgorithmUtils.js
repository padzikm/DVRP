
function startComputing() {
    var depotValidation = validateDepot();
    if (!depotValidation)
        return;
    $("#actions button").prop("disabled", true);
    isComputeReady = false;
    var func = function() {
        $("#actions button").prop("disabled", false);
        lock();
        computing = true;
    }
    sendDepot(function () {
        sendOrders(func, abortComputing, func);
    }, abortComputing);
}

function abortComputing() {
    var func = function () {
        unlock();
        isComputeReady = true;
    }
    computing = false;
    sendPostAjax(null, "/Home/AbortComputation", func, func);
}

function lock() {
    $("#computeBtn").text("Abort");
    $("#removeAllBtn").prop("disabled", true);
    $("#saveToFileBtn").prop("disabled", true);
    $("#readFromFileBtn").prop("disabled", true);
}

function unlock() {
    unlockDepot();
    unlockOrders();
    $("#computeBtn").text("Compute");
    $("#removeAllBtn").prop("disabled", false);
    $("#saveToFileBtn").prop("disabled", false);
    $("#readFromFileBtn").prop("disabled", false);
}

function lockDepot() {
    $("#depot").find("input, button[id='deleteDepotBtn']").prop("disabled", true);
}

function unlockDepot() {
    $("#depot").find("input, button").prop("disabled", false);
}

function lockOrder(orderId) {
    var selector = "#" + orderId;
    var $val = $(selector);
    $val.addClass("sent");
    $val.find("button[name^='delete']").prop("disabled", true);
    var marker = findMarker(orderId);
    marker.setDraggable(false);
}

function unlockOrders() {
    $("#orders tr.err").removeClass("err");
    $("#orders tr.sent").find("input, button").prop("disabled", false);
    $("#orders tr.sent").removeClass("sent");
    for (var i = 0, len = orderMarkers.length; i < len; ++i)
        orderMarkers[i].setDraggable(true);
}

function sendDepot(success, failure) {
    var inputs = $("#depot input");
    var data = serializeObj(inputs);
    lockDepot();
    sendPostAjax(data, "/Home/Compute", success, failure);
}

function sendOrders(success, failure, empty) {
    var jq = $();
    var min = currentMinute;
    var h = currentHour;
    $("#orders tr:gt(1):not(.sent, .err)").each(function (index, val) {
        var $val = $(val);
        if ($val.find("[id$='address']").val() === "")
            return;
        var orderId = $val.attr("id");
        if (!validateOrder(orderId, h, min)) {
            $("#" + orderId).addClass("err");
            return;
        }
        var inputs = $val.find("input");
        $.merge(jq, inputs);
        lockOrder(orderId);
    });
    if (jq.length === 0) {
        if(empty != null)
            empty();
        return;
    }
    var obj = serializeObj(jq);
    jq.prop("disabled", true);
    sendPostAjax(obj, "/Home/AddOrders", success, failure);
}
