
function geocoding(address, success, failure, data) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                success(results[0].geometry.location, address, data);
                return;
            }
        }
        if(failure != null)
            failure(data);

    });
}

function reverseGeocoding(latLng, success, failure, data) {
    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                success(latLng, results[0].formatted_address, data);
                return;
            }
        }
        if(failure != null)
            failure(data);
    });
}
