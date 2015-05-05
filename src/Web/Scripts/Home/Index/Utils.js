
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
    var o = {};
    var selector = "#" + formId;
    var a = $(selector).serializeArray();

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

function sendForm(formId, url, success, failure) {
    var selector = "#" + formId;
    var form = $(selector).serialize();
    $.ajax({
        url: url,
        data: form,
        method: "POST",
        success: function (data) {
            console.log(data);
            if (success == null)console.log("success");
            else success(data);
        },
        error: function () {
            if (failure == null)console.log("failure");
            else failure();
        }
    });
}
