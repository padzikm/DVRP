
var map;
var geocoder;
var depotMarker;
var depotInfoWindow;
var orderMarkers = [];
var orderInfoWindow;
var nextId = 0;
var timeStep = 1; //minutes
var currentHour;
var currentMinute;
var timeout = 5; //seconds
var computing = false;
var isComputeReady = true;
var orderTimeStopRatio = 0.5;