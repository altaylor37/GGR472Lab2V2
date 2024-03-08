mapboxgl.accessToken = 'pk.eyJ1IjoiYWx0YXlsb3IzNyIsImEiOiJjbHMyOWRoY2wwMWllMmtxam1yZjE3ams4In0.qdGA5yoWQbVEgPX3Tlru5A';

//Import style and map, center map on Canada.
const map = new mapboxgl.Map({
    container: 'myMap',
    style: 'mapbox://styles/altaylor37/cls29ky3c01ug01p2at938z40',
    center: [-105.2551, 56.1304],
    zoom: 3,
})

//NAV / FS Commands
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());



/*------------------------------------------------
AIRPORTS
List of airports. Conversion to GeoJSON. 
Add layer to map. Linear zoom. 
------------------------------------------------*/

//List of the top 10 busiest airport and some other relevant info stored in a list.
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
];


function addAirports() {
    airports.forEach(function(airport) {
        //Sidebar click zoom to airport.
        var el = document.createElement('div');
        el.innerHTML = airport.name;
        el.onclick = function() {
            map.flyTo({center: airport.coordinates, zoom: 10});
        };

        document.getElementById('airportList').appendChild(el);

        //Popup when click point to display more info abt airport
        // new mapboxgl.Marker()
        //     .setLngLat(airport.coordinates)//Add point to map
        //     .setPopup(new mapboxgl.Popup({ offset: 25 })//Make a popup
        //     .setHTML('<h3>' + airport.name + '</h3><p>Ranking ' + airport.ranking + '<br>Total Passengers in 2019: ' + airport.passengers + '<br>Province: ' + airport.province + '</p>' + '<br>'))
        //     .addTo(map);
    });
}
addAirports();


//CONVERT LIST TO GEOJSON
const airportGeoJSON = {
    type: 'FeatureCollection',
    features: airports.map(airport => ({
        type: 'Feature',
        properties: {
            name: airport.name,
            passengers: airport.passengers,
            province: airport.province,
            ranking: airport.ranking,
        },
        geometry: {
            type: 'Point',
            coordinates: airport.coordinates
        }
    }))
};




//LOAD GEOJSON AND USE A CUSTOM ZOOM FUNCTION
map.on('load', function() {
    map.addSource('airports', {
        type: 'geojson',
        data: airportGeoJSON
    });

    map.addLayer({
        id: 'airports',
        type: 'circle',
        source: 'airports',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5, 10,
                10, 5
            ],
            'circle-color': '#FFFFFF'
        }
    });
});



/*-----------------------------------------
AIR RAIL LINK GEOJSONS
-----------------------------------------*/

//Adding layers
map.on('load', () => {

    //UP Express - Toronto
    map.addSource('up-express', {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/altaylor37/GGR472Lab2V2/main/GeoJSONs/UPExpress.geojson',
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

    //Expo Line - Vancouver
    map.addSource('expo-line', {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/altaylor37/GGR472Lab2V2/main/GeoJSONs/ExpoLine.geojson',
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

    //REM - Montreal
    map.addSource('rem-line', {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/altaylor37/GGR472Lab2V2/main/GeoJSONs/REM.geojson',
    });
    map.addLayer({
        'id': 'rem-line-layer',
        'type': 'line',
        'source': 'rem-line',
        'paint': {
            "line-width": 5,
            "line-opacity": 1,
            "line-color": '#0b9927',
        }
    });



/*--------------------------------------
CANADA POPULATION DENSITY TILESET
Adding tileset, prepping it for hover functionality.
Organizing population density into a cloropleth map.
--------------------------------------*/
    // ADD LAYER - Population density of Canada by Province or Territory.
    // Layer made in ArcGIS Pro, check README file for data sources and construction process.
        map.addSource('provterr-data', {
            'type': 'vector',
            'url': 'mapbox://altaylor37.bysqohts'
        });
    
        map.addLayer({
            'id': 'provterr-fill',
            'type': 'fill',
            'source': 'provterr-data',
            'paint': {
                'fill-color': [
                    'step', // STEP expression produces stepped results based on value pairs
                    ['get', 'POPDENS'], // GET expression retrieves property value from 'POPDENS' data field
                    '#d9ffcc', // Colour assigned to any values < first step
                    5, '#8cff66', // Colours assigned to values >= each step
                    10, '#40ff00',
                    15, '#269900',
                    20, '#0d3300'
                ],
                'fill-opacity': 0.5,
                'fill-outline-color': 'white'
            },
            'source-layer': 'lpr_000b16a_e__FeaturesToJSO-92tkfj'
        });
})

// POINTER CURSOR WHEN OVER A PROVINCE / TERRITORY
// HIGHLIGHT PROVINCE / TERRITORY ON HOVER
map.on('mouseenter', 'provterr-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// SWITCH BACK TO NORMAL CURSOR WHEN NOT
// NO LONGER HIGHLIGHT PROVINCE / TERRITORY ON HOVER
map.on('mouseleave', 'provterr-fill', () => {
    map.getCanvas().style.cursor = '';
});



/*--------------------------------------
BUTTONS & POPUPS
--------------------------------------*/
 // Button to return to Canada view
document.getElementById('returnToCanada').onclick = function() {
    map.flyTo({center: [-105.2551, 56.1304], zoom: 3});
};

// LEGEND BUTTON FUNCTIONALITY - Listnes to see if the button is clicked or not, displays or hides the legend. 
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});

// LAYER BUTTON FUNCTIONALITY - Listens to see if the button is clicked or not, displays or hides the population density layer.
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'provterr-fill',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

// CLICKABLE POPULATION DENSITY POPUP ON PROVINCES AND TERRITORIES
map.on('click', 'provterr-fill', (e) => {
    new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Province/Territory:</b> " + e.features[0].properties.PRENAME + "<br>" +
            "Population Density: " + parseFloat(e.features[0].properties.POPDENS).toFixed(2) + " ppl per sqkm")//Use click event properties to write text for popup
        .addTo(map); //Show popup on map
});

// AIR RAIL LINK BUTTON
// --- !!!KNOWN BUG!!! --- When unchecking the box for the first time, the layers go away.
//                          When checking it again, the layers do not come back.
//                          I have tried this for a couple of days now and still have no idea what's wrong.
map.on('load', function(){
    function toggleAirRailLinks(checkboxId, layerIds) {
        const checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', function(e) {
            //Check the state of the checkbox
            const intendedVisibility = this.checked ? 'visible' : 'none';
            
            //Troubleshooting mostly
            layerIds.forEach(layerId => {
                const layerExists = map.getLayer(layerId);
                if (!layerExists) {
                    console.log(`Layer ${layerId} does not exist.`);
                    return;
                }
                //Change view state
                map.setLayoutProperty(layerId, 'visibility', intendedVisibility);
            });
        });
    }
    toggleAirRailLinks('airrailcheck', ['rem-line-layer', 'expo-line-layer', 'up-express-layer']);

    // AIRPORTS BUTTON
    function toggleAirports(checkboxId, layerId) {
        var checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', function() {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', this.checked ? 'visible' : 'none')
            }
        });
    }
    toggleAirports('airportscheck', 'airports')

});



// NEW AIRPORT HOVER POPUP
var hoverPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  
  //MOUSE ENTER - CHANGE POINTER, FIND COORDINATES, POPUP ON COORDINATES
  map.on('mouseenter', 'airports', function(e) {
    // Change the cursor style to pointer
    map.getCanvas().style.cursor = 'pointer';
    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var ranking = e.features[0].properties.ranking;
    var province = e.features[0].properties.province;
    var passengers = e.features[0].properties.passengers;
    var description = `<strong>${name}</strong><br>` + 
                        `Ranking: ${ranking}<br>` + 
                        `Province: ${province}<br>` + 
                        `Number of Passengers in 2022: ${passengers}`;
    //USE COORDINATES TO ENSURE THAT ZOOM DOES NOT AFFECT POSITION OF POPUP
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    hoverPopup.setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });
  
  //MOUSE EXIT - RESET POINTER
  map.on('mouseleave', 'airports', function() {
    map.getCanvas().style.cursor = '';
    hoverPopup.remove();
  });