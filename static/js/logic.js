// Store our API endpoint as queryUrl.
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function feature_popup(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.place}</h3><hr><p>${new Date(
        feature.properties.time
      )}</p>`
    );
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  //Make new function to style the markers
  function getColor(depth) {
    if (depth > 80) {
      return "#870000";
    }
    if (depth > 60) {
      return "#ff0000";
    }
    if (depth > 40) {
      return ;
    }
    if (depth > 20) {
      return "#00ff00";
    }
    if (depth > -50) {
      return "#ffff00";
    }"#d78700"
  }

  //Make new function to style marker radius
  function get_radius(magnitude) {
  return magnitude * 4
  }


 

  //Loop the data through
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, layer) {
      console.log(feature);
      return L.circleMarker(layer, {
        radius: get_radius(feature.properties.mag),
        fillOpacity: 0.85,
        color: getColor(feature.geometry.coordinates[2]),
      });
    },
    onEachFeature: feature_popup,
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes],
  });

   //Create the legend
   var legend = L.control({position: 'bottomright'});
   legend.onAdd = function () {
 
   var div = L.DomUtil.create('div', 'info legend');
   magnitudes = [0,1,2,3,4,5];
   colors = ["#ffff00", "#00ff00","#d78700", "#ff0000","#870000" ];
 
   for (var i = 0; i < magnitudes.length; i++) {
 
           div.innerHTML += 
           labels.push(
               '<i class="circle" style="background:' + getColor(magnitudes[i]) + '"></i> ' +
           (magnitudes[i] ? magnitudes[i] : '+'));
 
       }
       div.innerHTML = labels.join('<br>');
   return div;
   };
   legend.addTo(myMap);
  }