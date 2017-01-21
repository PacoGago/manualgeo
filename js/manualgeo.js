//Geolocalizacion HTML5
var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

//Geolocalizacion mediante GoogleAPI


//Parte de localizacion manual
var origin = {lat: 50.087, lng: 14.421};
var destination = {lat: 50.087, lng: 14.421};

var des = false;
var select = true;

$( "#des" ).click(function() {
  select = false;
});

$( "#ori" ).click(function() {
  select = true;
});

//markadores en el mapa: m_ori, m_des
var m_ori = {

  url: 'img/ori.png'
};

var m_des = {

  url: 'img/des.png'
};

//Marcadores google
var mg_ori;
var mg_des;

function initMap() {

  var markers = [];

  //************************************************************
  //ATENCION: AQUI LA GEOLOCALIZACION
  var myLatlng = new google.maps.LatLng(36.71002319999999, -6.1244236);
  //************************************************************

  var myOptions = {
    zoom: 15,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

  //Permite añadir un puntero
  function addMarker(location) {

    if(select){

      if (mg_ori!=null) {
        mg_ori.setMap(null);
      }

      mg_ori = new google.maps.Marker({
        position: location,
        icon: m_ori,
        map: map
      });

    }else{

      if (mg_des!=null) {
        mg_des.setMap(null);
      }

      mg_des = new google.maps.Marker({
        position: location,
        icon: m_des,
        map: map
      });

    }
  }

  var geocoder = new google.maps.Geocoder();

  google.maps.event.addListener(map, 'click', function(event) {
    geocoder.geocode({
      'latLng': event.latLng
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          if(select){

            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            origin = {lat: latitude, lng: longitude};

            addMarker(event.latLng);
            document.getElementById("p1").innerHTML = results[0].formatted_address;

            var address_components = results[0].address_components;
            var components={};
            jQuery.each(address_components, function(k,v1) {jQuery.each(v1.types, function(k2, v2){components[v2]=v1.long_name});})
            //Contenido de components
            //street_number: "1100",
            // route: "E Hector St",
            // locality: "Conshohocken",
            // political: "United States",
            // administrative_area_level_3: "Whitemarsh"…
            // administrative_area_level_1: "Pennsylvania"
            // administrative_area_level_2: "Montgomery"
            // administrative_area_level_3: "Whitemarsh"
            // country: "United States"
            // locality: "Conshohocken"
            // political: "United States"
            // postal_code: "19428"
            // route: "E Hector St"
            // street_number: "1100"

            document.getElementById("p4").innerHTML = "Destination.Street: " + components.route;
            document.getElementById("p5").innerHTML = "Origin.City: " + components.locality;
            document.getElementById("p6").innerHTML = "Origin.Territory: " + components.administrative_area_level_2;
            document.getElementById("p12").innerHTML = "OriginCoordinates.X: " + longitude;
            document.getElementById("p13").innerHTML = "OriginCoordinates.Y: " + latitude;

          }else{

            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            destination = {lat: latitude, lng: longitude};

            addMarker(event.latLng);
            document.getElementById("p2").innerHTML = results[0].formatted_address;

            var address_components = results[0].address_components;
            var components={};
            jQuery.each(address_components, function(k,v1) {jQuery.each(v1.types, function(k2, v2){components[v2]=v1.long_name});})
            //Contenido de components
            //street_number: "1100",
            // route: "E Hector St",
            // locality: "Conshohocken",
            // political: "United States",
            // administrative_area_level_3: "Whitemarsh"…
            // administrative_area_level_1: "Pennsylvania"
            // administrative_area_level_2: "Montgomery"
            // administrative_area_level_3: "Whitemarsh"
            // country: "United States"
            // locality: "Conshohocken"
            // political: "United States"
            // postal_code: "19428"
            // route: "E Hector St"
            // street_number: "1100"

            document.getElementById("p7").innerHTML = "Destination.Street: " + components.route;
            document.getElementById("p8").innerHTML = "Origin.City: " + components.locality;
            document.getElementById("p9").innerHTML = "Origin.Territory: " + components.administrative_area_level_2;
            document.getElementById("p15").innerHTML = "No required API: DestinationCoordinates.X: " + longitude;
            document.getElementById("p16").innerHTML = "No required API: DestinationCoordinates.Y: " + latitude;


            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
              }, callback);

              function callback(response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK) {
                  var origins = response.originAddresses;
                  var destinations = response.destinationAddresses;

                  for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                      var element = results[j];
                      var distance = element.distance.text;

                      document.getElementById("p10").innerHTML = "Kms: " + distance;
                    }
                  }
                }
              }

          }
        }
      }
    });
  });
}
