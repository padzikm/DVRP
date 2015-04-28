
function setEvents() {
    $("#computeBtn").click(function(e) {
        e.preventDefault();
    });

    $("#depotAddress").blur(function(e) {
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
        var firstId = $("#orders").children().first().attr("id");
        var addressId = "#address_" + firstId;
        var address = $(addressId).val();
        if (address === "")
            return;
        geocoding(address, addOrderHandler, { Id: firstId });
    });

    $(document).on("blur", "[name^='address_']", function(e) {
        var firstId = $("#orders").children().first().attr("id");
        var divId = $(this).parent().first().attr("id");
        if (firstId === divId)
            return;
        var address = $(this).val();
        var marker = findMarker(divId);
        if (marker != null) {
            $(this).siblings("button[name='showOrderBtn']").prop("disabled", true);
            removeOrderMarker(marker);
        }
        if (address === "") {
            var any = false;
            $(this).siblings("input").each(function() {
                if ($(this).val() !== "")
                    any = true;
            });
            if (!any) {
                $(this).parent().remove();
                return;
            }
        }
        geocoding(address, createOrder, { Id: divId });
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
        var divId = "#" + dataId;
        $(divId).remove();
    });
}
