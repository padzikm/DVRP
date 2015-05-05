
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

function serialize(formId) {
    var selector = "#" + formId;
    var obj = $(selector);
    return serializeObj(obj);
}

function serializeObj(obj) {
    var o = {};
    var a = obj.serializeArray();
    //console.log(a);
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    return o;
}

function sendFormAjax(formId, url, success, failure) {
    var selector = "#" + formId;
    var formData = $(selector).serialize();
    sendPostAjax(formData, url, success, failure);
}

function sendPostAjax(data, url, success, failure) {
    //console.log("post");
    //a = data;
    //console.log(data);
    $.ajax({
        url: url,
        data: data,
        method: "POST",
        traditional: true,
        success: function (data) {
            //console.log(data);
            if (success == null) console.log("success");
            else success(data);
        },
        error: function () {
            if (failure == null) console.log("failure");
            else failure();
        }
    });
}
