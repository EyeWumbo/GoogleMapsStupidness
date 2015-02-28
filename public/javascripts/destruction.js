function initialize() {
  var lat, lon = 0;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var mapOptions = {
        center: { lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 10,
        minZoom: 3
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }, function(err){
      if(err.code == err.PERMISSION_DENIED){
        var mapOptions = {
          center: { lat: 55.75, lng: 37.6167},
          zoom: 10,
          minZoom: 3
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      }
    });
  }
  else {
    var mapOptions = {
        center: { lat: 55.75, lng: 37.6167},
        zoom: 10,
        minZoom: 3
      };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }

	
	
}
$(function(){
  google.maps.event.addDomListener(window, 'load', initialize);
})
