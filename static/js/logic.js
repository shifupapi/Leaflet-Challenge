//store the URL for the GeoJSON data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streets]
});

//define basemaps as the streetmap
let baseMaps = {
    "streets": streets
};

//define the earthquake layergroup and tectonic plate layergroups for the map
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//this styleInfo function will dictate the stying for all of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),

//sets radius based on magnitude 
        radius: chooseRadius(feature.properties.mag), 

//sets fillColor based on the depth of the earthquake
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "blue";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "red";
    else if (depth > 40 & depth <= 55) return "black";
    else if (depth > 55 & depth <= 70) return "yellow";
    else return "purple";
};

//define a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*5;
};

//pull the earthquake JSON data with d3
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) { 
//declare a point to layer function that takes a feature and latlon
//function creates a circleMarker at latlon and binds a popup with the earthquake id
            return L.circleMarker(latlon).bindPopup(feature.id);
        },

//style the CircleMarker with the styleInfo function as defined above
        style: styleInfo 
// add the earthquake data to the earthquake_data layergroup / overlay
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);

//this function pulls the tectonic plate data and draws a fuchsia line over the plates
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { //pulls tectonic data with d3.json
        L.geoJson(data, {
//sets the line color to fuchsia
            color: "fuchsia", 
            weight: 3
//add the tectonic data to the tectonic layergroup / overlay
        }).addTo(tectonics); 
        tectonics.addTo(myMap);
    });


});
//create legend, credit to this website for the structure: https://codepen.io/haakseth/pen/KQbjdO -- this structure is referenced in style.css
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background: red"></i><span>(Depth < 10)</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';

 return div;
};
//add the legend to the map
legend.addTo(myMap);

//scratch work for collecting the necessary  and console logging
//collect data with d3
d3.json(url).then(function (data) {
 console.log(data);
 let features = data.features;
 console.log(features);

 let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
 let first_result = results[0];
 console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});
   
  
  