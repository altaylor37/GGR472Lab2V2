mapboxgl.accessToken = 'pk.eyJ1IjoiYWx0YXlsb3IzNyIsImEiOiJjbHMyOWRoY2wwMWllMmtxam1yZjE3ams4In0.qdGA5yoWQbVEgPX3Tlru5A';

const map = new mapboxgl.Map({
    container: 'myMap',
    style: 'mapbox://styles/altaylor37/cls29ky3c01ug01p2at938z40',
    center: [-105.2551, 56.1304],
    zoom: 3,
})

const airports = [
    { name: "Toronto Pearson International Airport", coordinates: [-79.6306, 43.6777], passengers: "50.5M" , province: "ON", ranking: "1"},
    { name: "Vancouver International Airport", coordinates: [-123.184, 49.1951], passengers: "26.4M", province: "BC", ranking: "2"},
    { name: "Montéal-Trudeau International Airport", coordinates: [-73.7408, 45.4706], passengers: "20.3M", province: "QC", ranking: "3"},
    { name: "Calgary International Airport", coordinates: [-114.0076, 51.1215], passengers: "17.9M", province: "AB", ranking: "4"},
    { name: "Edmonton International Airport", coordinates: [-113.5897, 53.3097], passengers: "8.1M", province: "AB", ranking: "5"},
    { name: "Ottawa Macdonald-Cartier Inernational Airport", coordinates: [-75.6692, 45.3225], passengers: "5.1M", province: "ON", ranking: "6"},
    { name: "Winnipeg James Armstrong Richardson International Airport", coordinates: [-97.2399, 49.9100], passengers: "4.5M", province: "MB", ranking: "7"},
    { name: "Halifax Stanfield International Airport", coordinates: [-63.5068, 44.8808], passengers: "4.2M", province: "NS", ranking: "8"},
    { name: "Billy Bishop Toronto City Airport", coordinates: [-79.3962, 43.6275], passengers: "2.8M", province: "ON", ranking: "9"},
    { name: "Kelowna International Airport", coordinates: [-119.3778, 49.9561], passengers: "2.0M", province: "BC", ranking: "10"},

    // Add the rest of the airports with similar structure
];

function addAirports() {
    airports.forEach(function(airport) {
        // Add to list
        var el = document.createElement('div');
        el.innerHTML = airport.name;
        el.onclick = function() {
            map.flyTo({center: airport.coordinates, zoom: 10});
        };
        document.getElementById('airportList').appendChild(el);

        // Add point on map
        new mapboxgl.Marker()
            .setLngLat(airport.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('<h3>' + airport.name + '</h3><p>Ranking ' + airport.ranking + '<br>Total Passengers in 2019: ' + airport.passengers + '<br>Province: ' + airport.province + '</p>'))
            .addTo(map);
    });
}

map.on('load', function() {
    addAirports();
});

// Button to return to Canada view
document.getElementById('returnToCanada').onclick = function() {
    map.flyTo({center: [-105.2551, 56.1304], zoom: 3});
};


map.on('load', () => {

    map.addSource('up-express', {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/altaylor37/GGR472Lab2V2/main/UPExpress.geojson',
    });

    map.addLayer({
        'id': 'up-express-layer',
        'type': 'line',
        'source': 'up-express',
        'paint': {
            "line-width": 5,
            "line-opacity": 1,
            "line-color": '#591f16',
        }
    });

    map.addSource('expo-line', {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/altaylor37/GGR472Lab2V2/main/ExpoLine.geojson',
    });

    map.addLayer({
        'id': 'expo-line-layer',
        'type': 'line',
        'source': 'expo-line',
        'paint': {
            "line-width": 5,
            "line-opacity": 1,
            "line-color": '#11297d',
        }
    });


})