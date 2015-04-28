
function geocoding(address, func, data) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var latLng = results[0].geometry.location;
            func(latLng, address, data);
        }
    });
}

function reverseGeocoding(latLng, func, data) {
    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0])
                func(latLng, results[0].formatted_address, data);
        }
    });
}
