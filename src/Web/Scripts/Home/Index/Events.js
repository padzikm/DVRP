
function setEvents() {
    $("#computeBtn").click(function (e) {
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
        
        e.preventDefault();
    });

    $("#depot.address").blur(function(e) {
        var address = $(this).val();
        if (address === "") {
            removeDepotMarker();
            $("#showDepotBtn").prop("disabled", true);
            return;
        }
        geocoding(address, createDepot);
    });

    $("#showDepotBtn").click(function(e) {
        e.preventDefault();
        if (depotMarker != null)
            depotMarker.infoWindow.open(map, depotMarker);
    });

    $("#deleteDepotBtn").click(function(e) {
        e.preventDefault();
        removeDepotMarker();
        $("#depot input").val("");
        $("#showDepotBtn").prop("disabled", true);
    });

    $("#addOrderBtn").click(function(e) {
        e.preventDefault();
        var firstId = findNotAddedOrderId();
        var selector = "#" + firstId;
        var address = $(selector).find("input[name$='address']").val();
        if (address === "")
            return;
        geocoding(address, addOrderHandler, { Id: firstId });
    });

    $(document).on("blur", "[name^='orders['][name$='].address']", function (e) {
        var firstId = findNotAddedOrderId();
        var thisId = findInputOrderId(this);
        if (firstId === thisId)
            return;
        var thisSelector = "#" + thisId;
        var address = $(this).val();
        var marker = findMarker(thisId);
        if (marker != null) {
            $(thisSelector).find("button[name='showOrderBtn']").prop("disabled", true);
            removeOrderMarker(marker);
        }
        if (address === "") {
            var any = false;
            $(thisSelector).find("input").each(function () {
                if ($(this).val() !== "")
                    any = true;
            });
            if (!any) {
                $(thisSelector).remove();
                return;
            }
        }
        geocoding(address, createOrder, { Id: thisId });
    });

    $(document).on("click", "button[name='showOrderBtn']", function(e) {
        e.preventDefault();
        var dataId = $(this).data("id");
        var marker = findMarker(dataId);
        marker.infoWindow.open(map, marker);
    });

    $(document).on("click", "button[name='deleteOrderBtn']", function(e) {
        e.preventDefault();
        var dataId = $(this).data("id");
        var marker = findMarker(dataId);
        removeOrderMarker(marker);
        var thisId = "#" + dataId;
        $(thisId).remove();
    });
}
