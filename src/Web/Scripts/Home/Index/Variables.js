
var map;
var geocoder;
var depotMarker;
var orderMarkers = [];
var nextId = 0;
var timeStep = 1;
var currentHour;
var currentMinute;
var timeout = 5;
var computing = false;