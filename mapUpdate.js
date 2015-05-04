
//Global variable for map manipulation without reload
var geocoder;
var map;

//variable for the marker, used to adjust marker animation
var marker;

//variables for weather,used to adjust weather layer
var weatherLayer;
var cloudLayer;

//Function that creates the map and sets its default options
////////////////////////////////////////////////////////////////////////////
function createMap() {
  
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 10,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.STREET,
    disableDefaultUI: true
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  //variables that create the weather layer
  weatherLayer = new google.maps.weather.WeatherLayer({
  temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT});
  cloudLayer = new google.maps.weather.CloudLayer();
  
  }
///////////////////////////////////////////////////////////////////////////////////

//Function that sets the address for the map to display
////////////////////////////////////////////////////////////////////////////////////
function codeAddress() {
 createMap(); //call function to create map

  var address = document.getElementById('address').value;//Default address is the address field in the form
  if(document.getElementById('useAddressBox').checked)//Alternate address options currently earthquake box.
  {
  	address = document.getElementById('address').value;
  }
  if(document.getElementById('useCoord').checked)
  {
  	address = document.getElementById('lat').value;
  }
  if(document.getElementById('useLocation').checked)
  {
  	function getLocation()
	{
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	function showPosition(position)
	{
		var userPosition = position.coords.latitude + "," + position.coords.longitude;
        document.getElementById('lat').value = userPosition;
	}
	getLocation();
	address = document.getElementById('lat').value;
	
  }
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      
      var coordinates = results[0].geometry.location;
      var textAddress = results[0].formatted_address;
      document.getElementById('lat').value = coordinates;
      document.getElementById('address').value = textAddress;
      
       marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
		  animation: google.maps.Animation.NONE,
		  title: results[0].formatted_address
      });
    
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
  
 //These functions need to be called to ensure that options selected are options that are displayed on map
 //when codeAddress() is called to select a new address.
  changeAnimation();
  changeMapStyle();
  showWeather();
  changeZoom();
  whichEarthquakeData();
}
///////////////////////////////////////////////////////////////////////////////

//Function to change marker animation
//////////////////////////////////////////////////////////////////////////////
function changeAnimation(){
 //Change the Animation Type based on radio button input
  if(document.getElementById('bounce').checked)
  {
		marker.setAnimation(google.maps.Animation.BOUNCE);
  }
  else if(document.getElementById('drop').checked)
  {		
		marker.setAnimation(google.maps.Animation.DROP);
  }
  else if(document.getElementById('none').checked)
  {
		marker.setAnimation(google.maps.Animation.NONE);
  }
}
/////////////////////////////////////////////////////////////////////////////

//Function to change map style
/////////////////////////////////////////////////////////////////////////////
function changeMapStyle(){
//Change the Map Type based on radio button input
  if(document.getElementById('satellite').checked)
  {
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
  }
  else if(document.getElementById('street').checked)
  {
		map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  }
  else if(document.getElementById('hybrid').checked)
  {
		map.setMapTypeId(google.maps.MapTypeId.HYBRID);
  }
  else if(document.getElementById('terrain').checked)
  {
		map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
  }
}
/////////////////////////////////////////////////////////////////////////////


//Function to show weather
/////////////////////////////////////////////////////////////////////////////
function showWeather(){  

	if (document.getElementById('weatherOn').checked) {
	  weatherLayer.setMap(map);
	  cloudLayer.setMap(map);
	}
	 else{
	  weatherLayer.setMap(null);
	  cloudLayer.setMap(null);
	 }
}
/////////////////////////////////////////////////////////////////////////////


//function for zoom with slider
////////////////////////////////////////////////////////////////////////////////
function changeZoom(){

	value=document.getElementById('zoom').value;
	map.setZoom(parseInt(value));
}
////////////////////////////////////////////////////////////////////////////////

//Functions to make earthquake locations appear
////////////////////////////////////////////////////////////////////////////
//Function that decides which earthquake data to get
function whichEarthquakeData(){

  if (document.getElementById('hourQuake').checked){
  //past hour all quakes
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/all_hour.geojsonp';
  getEarthquakes(url);
  }
  if (document.getElementById('dayQuake').checked){
  //past day all quakes
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/all_day.geojsonp';
  getEarthquakes(url);
  }
  if (document.getElementById('weekQuake').checked){
  //Past 7 days M1+ quakes
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/1.0_week.geojsonp';
  getEarthquakes(url);
  }
  if (document.getElementById('monthQuake').checked){
  //Past 30 days M2.5+ quakes
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/2.5_month.geojsonp'
  getEarthquakes(url);
  }
}

//Function that takes the data provided by the source and applies it to the map
function getEarthquakes(url){
  var magLabel = "Magnitude: "
  var quakeData = document.createElement('script');
  quakeData.src = url;
  document.getElementsByTagName('head')[0].appendChild(quakeData);

  //Function that gets data from .jsonp and sets the data
  eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var earthquake = results.features[i];
	var magnitude = earthquake.properties.mag;
    var quakeCoords = earthquake.geometry.coordinates;
    var quakeLatLng = new google.maps.LatLng(quakeCoords[1],quakeCoords[0]);
    var quakeMarker = new google.maps.Marker({
      position: quakeLatLng,
      map: map,
	  title: magLabel.concat(String(magnitude)),
	  animation: google.maps.Animation.DROP
    });
   }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);