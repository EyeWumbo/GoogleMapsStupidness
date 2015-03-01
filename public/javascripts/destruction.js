var markers = [];
var areas = [];
var totalArea = 100;

function removeFromMarkers(marker){
  for(var i = 0; i < markers.length; i ++){
    if(markers[i] === marker){
      markers.splice(i, 1);
    }
  }
}

function removeFromAreas(area){
  for(var i = 0; i < areas.length; i ++){
    if(areas[i] === area){
      areas.splice(i, 1);
    }
  }
}

function getRectArea(rect){
  var sw = rect.bounds.getSouthWest();
  var ne = rect.bounds.getNorthEast();
  var southWest = new google.maps.LatLng(sw.lat(), sw.lat());
  var southEast = new google.maps.LatLng(sw.lat(), ne.lat());
  var northWest = new google.maps.LatLng(ne.lat(), sw.lat());
  var northEast = new google.maps.LatLng(ne.lat(), ne.lat());
  return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]) / (1000000);
}

function genRectWithListeners(details){
  var rectangle = new google.maps.Rectangle(details);
  google.maps.event.addListener(rectangle, 'dblclick', function(e){
    rectangle.setMap(null);
  });
  google.maps.event.addListener(rectangle, 'resize', function(e){
    if(totalArea - area < 0){
      alert('Overstepping area limitations')
      rectangle.setMap(null);
      return;
    }
    totalArea -= area;
  })
  area = getRectArea(rectangle);
  if(totalArea - area < 0){
    alert('Overstepping area limitations')
    rectangle.setMap(null);
    return;
  }
  totalArea -= area;
  $('#total-area').text(totalArea);
  areas.push(rectangle);
}

function genMarkerWithListeners(details){
  if(markers.length == 2){
    alert('You can only have two markers up at a time');
    return;
  }
  if(areas.length == 5){
    alert('You can only have 5 areas at a time.');
    return;
  }
  marker = new google.maps.Marker(details);
  google.maps.event.addListener(marker, 'click', function(e){
    removeFromMarkers(marker);
    marker.setMap(null);
  })
  markers.push(marker);
  if(markers.length == 2){
    genRectWithListeners({
      strokeColor: '#A6A938',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#A6A938',
      fillOpacity: 0.3,
      map: details.map,
      draggable: true,
      editable: true,
      bounds: new google.maps.LatLngBounds(
        markers[0].position,
        markers[1].position
      )
    })
    markers.forEach(function(el, index, array){
      el.setMap(null);
    });
    markers = [];
  }
  return marker;
}

function genMapWithListeners(options){
  var map = new google.maps.Map(document.getElementById('map-canvas'), options);
  google.maps.event.addListener(map, 'click', function(e){
    marker = genMarkerWithListeners({
      position: e.latLng,
      map: map,
      draggable: true
    });
  });
  socket.on('attack', function(content){
    generatedAttack = [];
    content.areas.forEach(function(thing, index, arr){
      genAttackArea(genAttackArea(thing, map));
    })
  })  
}

var genAttackArea = function(bounds, map){
  console.log(bounds);
  return new google.maps.Rectangle({
    strokeColor: '#5C1212',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#5C1212',
    fillOpacity: 0.3,
    map: map,
    draggable: true,
    editable: true,
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds['sw'][0], bounds['sw'][1]),
      new google.maps.LatLng(bounds['ne'][0], bounds['ne'][1])
    )
  });
}

function initialize() {
  var lat, lon = 0;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var mapOptions = {
        center: { lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 10,
        minZoom: 3,
        disableDoubleClickZoom: true
      };
      genMapWithListeners(mapOptions);
    }, function(err){
      if(err.code == err.PERMISSION_DENIED){
        var mapOptions = {
          center: { lat: 55.75, lng: 37.6167},
          zoom: 10,
          minZoom: 3,
          disableDoubleClickZoom: true
        };
        genMapWithListeners(mapOptions);
      }
    });
  }
  else {
    var mapOptions = {
        center: { lat: 55.75, lng: 37.6167},
        zoom: 10,
        minZoom: 3,
        disableDoubleClickZoom: true
      };
    genMapWithListeners(mapOptions);
  }
}

$(function(){
  google.maps.event.addDomListener(window, 'load', initialize);
  $('#total-area').text(totalArea);
  $('#report-area').click(function(e){
    e.preventDefault();
    bounds = [];
    areas.forEach(function(thing, index, arr){
      set = {};
      set['sw'] = [thing.getBounds().getSouthWest().lat(), thing.getBounds().getSouthWest().lng()]
      set['ne'] = [thing.getBounds().getNorthEast().lat(), thing.getBounds().getNorthEast().lng()]
      bounds.push(set);
    })
    socket.emit('submits', {areas: bounds});
    alert('pushed');
  })
})
