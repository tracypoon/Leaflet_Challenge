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
    if (depth >5) 
    {return "#5f0000"} 
    if (depth >4)  
    {return "#ff0000"} 
  }


  //Loop the data through
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, layer) {
    return L.circleMarker(layer, {radius: 10, fillOpacity: 0.85, color: getColor(feature.geometry.coordinates[2]);
      },
    onEachFeature: feature_popup,
  });

  // Send our earthquakes layer to the createMap function/
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

  //Create circle markers
  // Setting the marker radius for the state by passing population into the markerSize function

  // stateMarkers.push(
  //   L.circle(locations[i].coordinates, {
  //     stroke: false,
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: "white",
  //     radius: markerSize(locations[i].state.population)
  //   })
  // );

  // //Utilize geojson to style the markers
  // L.geoJson(data, {
  //   style: function (feature) {
  //     return {color: feature.properties.color};
  //   },
  //   onEachFeature: function (feature, layer) {
  //     layer.bindPopup(feature.properties.description);
  //   }
  // }).addTo(map);

  // //Create legend
  // var legend = L.control({
  //   position: "bottomright",
  // });
  // legend.onAdd = function (map) {
  //   var div = L.DomUtil.create("div", "info legend"),
  //     labels = ["<strong>index</strong>"],
  //     lower = [0, 0.16, 0.33, 0.44, 0.51],
  //     upper = [0.15, 0.32, 0.43, 0.5, 0.68];

  //   for (var i = 0; i < lower.length; i++) {
  //     div.innerHTML += labels.push(
  //       '<i style="background:' +
  //         getColorInd(lower[i]) +
  //         '"></i> ' +
  //         lower[i] +
  //         "&ndash;" +
  //         upper[i]
  //     );
  //   }
  //   div.innerHTML = labels.join("<br>");
  //   return div;
  // };

  // legend.addTo(map);

  // var geojson = L.geoJson(Sample, {
  //   style: styleInd,
  //   onEachFeature: onEachFeature_LMA,
  // }).addTo(map);

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

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}
