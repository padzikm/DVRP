
function setEvents() {
    $("#computeBtn").click(function (e) {
        e.preventDefault();
        var firstId = findNotAddedOrderId();
        var selector = "#" + firstId + " input";
        $(selector).prop("disabled", true);
        var form = $("#formId").serialize();
        $(selector).prop("disabled", false);

        $.ajax({
            url: "/Home/Compute",
            data: form,
            method: "POST",
            success: function (data) { console.log(data); },
            error: function () { console.log("failed"); }
        });
    });

    $("#depot\\.address").blur(function (e) {
        var address = $(this).val();
        geocoding(address, updateDepotMarker, removeDepotMarker);
    });

    $("#showDepotBtn").click(function (e) {
        e.preventDefault();
        if (depotMarker != null) {
            depotMarker.infoWindow.open(map, depotMarker);
            map.panTo(depotMarker.getPosition());
        }
    });

    $("#deleteDepotBtn").click(function (e) {
        e.preventDefault();
        removeDepot();
    });

    $("#addOrderBtn").click(function (e) {
        e.preventDefault();
        var firstId = findNotAddedOrderId();
        var selector = "#" + firstId + " [name$='address']";
        var address = $(selector).val();
        console.log(address);
        geocoding(address, addOrderHandler, null, { id: firstId });
    });

    $(document).on("blur", "[id='orders'] [name$='.address']", function (e) {
        var firstId = findNotAddedOrderId();
        var thisId = findInputOrderId(this);
        if (firstId === thisId)
            return;

        var address = $(this).val();

        var failure = function (data) {
            var any = false;
            var thisSelector = "#" + data.id;
            $(thisSelector).find("input:not([type='hidden']):not([name$='.address'])").each(function () {
                if ($(this).val() !== "")
                    any = true;
            });
            if (any)
                removeOrderMarker(data.id);
            else
                removeOrder(data.id);
        }
        geocoding(address, updateOrderMarker, failure, { id: thisId });
    });

    $(document).on("click", "button[name='showOrderBtn']", function (e) {
        e.preventDefault();
        var dataId = $(this).data("id");
        var marker = findMarker(dataId);
        marker.infoWindow.open(map, marker);
        map.panTo(marker.getPosition());
    });

    $(document).on("click", "button[name='deleteOrderBtn']", function (e) {
        e.preventDefault();
        var id = $(this).data("id");
        removeOrder(id);
    });

    $("#removeAllBtn").click(function (e) {
        e.preventDefault();
        removeDepot();
        var firstId = findNotAddedOrderId();
        var $obj = $("#orders tr");
        $.each($obj, function (index, value) {
            var id = $(value).attr("id");
            if (id != null && id !== firstId)
                removeOrder(id);
        });
    });

    $("#saveToFileBtn").click(function (e) {
        e.preventDefault();
        var firstId = findNotAddedOrderId();
        var selector = "#" + firstId + " input";
        $(selector).prop("disabled", true);
        var json = serialize("formId");
        $(selector).prop("disabled", false);
        var data = JSON.stringify(json);
        var blob = new Blob([data], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.download = "dvrp.json";
        a.href = url;
        a.click();
    });

    $("#readFromFileBtn").click(function (e) {
        e.preventDefault();
        $("#file").click();
    });

    $("#file").change(function (evt) {
        var jsonObj = null;
        var files = evt.target.files;
        var f = files[0];
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                jsonObj = JSON.parse(e.target.result);

                insertDepot(jsonObj);
                insertOrders(jsonObj);
            };
        })(f);

        reader.readAsText(f);
    });

    $("[id='orders[0].openHour'], [id='depot.openHour'], [id='depot.closeHour']").timepicker({
        minuteStep: 1,
        showMeridian: false
    });
}
