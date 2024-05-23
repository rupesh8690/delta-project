
   var map = L.map('map').setView([0,0], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var latlng = e.geocode.center;
    console.log('Latitude:', latlng.lat);
    console.log('Longitude:', latlng.lng);
   
    L.marker(latlng).addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();
    map.setView(latlng, map.getZoom());
})
.addTo(map);