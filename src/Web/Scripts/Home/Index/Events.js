
function setEvents() {
    $("#computeBtn").click(function(e) {
        e.preventDefault();
        if (!computing && isComputeReady) {
            isComputeReady = false;
            var firstId = findNotAddedOrderId();
            var selector = "#" + firstId + " input";
            $(selector).prop("disabled", true);
            var data = $("#formId").serialize();
            $("#depot").find("input, button[id='deleteDepotBtn']").prop("disabled", true);
            $("#orders tr:gt(1)").addClass("sent");
            $("#orders tr:gt(1)").find("input, button[name^='delete']").prop("disabled", true);
            $("#computeBtn").text("Abort");
            $("#removeAllBtn").prop("disabled", true);
            $("#saveToFileBtn").prop("disabled", true);
            $("#readFromFileBtn").prop("disabled", true);
            $(selector).prop("disabled", false);
            sendPostAjax(data, "/Home/Compute", function (dat) {
                console.log("success");
                computing = true;
            }, function() {
                unlockDepot();
                unlockOrders();
                $("#computeBtn").text("Compute");
                $("#removeAllBtn").prop("disabled", false);
                $("#saveToFileBtn").prop("disabled", false);
                $("#readFromFileBtn").prop("disabled", false);
                isComputeReady = true;
            });
        }
        else if(computing) {
            computing = false;
            func = function() {
                unlockDepot();
                unlockOrders();
                $("#computeBtn").text("Compute");
                $("#removeAllBtn").prop("disabled", false);
                $("#saveToFileBtn").prop("disabled", false);
                $("#readFromFileBtn").prop("disabled", false);
                isComputeReady = true;
            }
            sendPostAjax(null, "/Home/AbortComputation", func, func);
        }
    });

    $("#depot\\.address").blur(function(e) {
        var address = $(this).val();
        geocoding(address, updateDepotMarker, removeDepotMarker);
    });

    $("#showDepotBtn").click(function(e) {
        e.preventDefault();
        if (depotMarker != null) {
            depotInfoWindow.open(map, depotMarker);
            map.panTo(depotMarker.getPosition());
        }
    });

    $("#deleteDepotBtn").click(function(e) {
        e.preventDefault();
        removeDepot();
    });

    $("#addOrderBtn").click(function(e) {
        e.preventDefault();
        var firstId = findNotAddedOrderId();
        var selector = "#" + firstId + " [name$='address']";
        var address = $(selector).val();
        
        geocoding(address, addOrderHandler, null, { id: firstId });
    });

    $(document).on("blur", "[id='orders'] [name$='.address']", function(e) {
        var thisId = findInputOrderId(this);

        var address = $(this).val();

        var failure = function(data) {
            var any = false;
            var thisSelector = "#" + data.id;
            $(thisSelector).find("input:not([type='hidden']):not([name$='.address'])").each(function() {
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

    $(document).on("click", "button[name='showOrderBtn']", function(e) {
        e.preventDefault();
        var dataId = $(this).data("id");
        var marker = findMarker(dataId);
        var selector = "[id='orders[" + dataId + "].address']";
        var address = $(selector).val();
        orderInfoWindow.setContent(address);
        orderInfoWindow.open(map, marker);
        map.panTo(marker.getPosition());
    });

    $(document).on("click", "button[name='deleteOrderBtn']", function(e) {
        e.preventDefault();
        var id = $(this).data("id");
        removeOrder(id);
    });

    $("#removeAllBtn").click(function(e) {
        e.preventDefault();
        removeDepot();
        var firstId = findNotAddedOrderId();
        var $obj = $("#orders tr");
        $.each($obj, function(index, value) {
            var id = $(value).attr("id");
            if (id != null && id !== firstId)
                removeOrder(id);
        });
    });

    $("#saveToFileBtn").click(function(e) {
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

    $("#readFromFileBtn").click(function(e) {
        e.preventDefault();
        $("#file").click();
    });

    $("#file").change(function(evt) {
        var jsonObj = null;
        var files = evt.target.files;
        var f = files[0];
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                jsonObj = JSON.parse(e.target.result);

                insertDepot(jsonObj);
                insertOrders(jsonObj);
            };
        })(f);

        reader.readAsText(f);
    });

    $("[id$='Time']").timepicker({
        minuteStep: 1,
        showMeridian: false
    });

    $("#timeStep").on("input change", function(e) {
        var val = $(this).val();
        var text = "x " + val;
        $("#timeStepVal").val(text);
    });

    $("#timeStep").change(function (e) {
        timeStep = parseInt($(this).val());
    });
}
