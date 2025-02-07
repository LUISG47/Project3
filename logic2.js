// Store our API endpoint as queryUrl.
let query2Url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Perform a GET request to the query URL
d3.json(query2Url).then(function(data) {
    console.log("Data fetched successfully:", data); // Log the fetched data
    createHeatMap(data.data); // Now it will create a heatmap of meteorite falls
}).catch(error => {
    console.error("Error fetching data:", error);
});

// Function to count meteorites globally based on their coordinates
function countMeteorites(meteoriteData) {
    const coordinates = [];

    // Push each meteorite's coordinates to the array
    meteoriteData.forEach(meteorite => {
        if (meteorite[13] === "Found") {
            const latitude = parseFloat(meteorite[15]);
            const longitude = parseFloat(meteorite[16]);
            if (!isNaN(latitude) && !isNaN(longitude) && latitude && longitude) {
                coordinates.push([longitude, latitude]); // Note: Leaflet works with [longitude, latitude]
            }
        }
    });
    
    return coordinates;
}

// Function to create a chloropleth map showing meteorite falls
function createHeatMap(meteoriteData) {
    const coordinates = countMeteorites(meteoriteData);
    
    // Prepare geojson data for all meteorite coordinate points
    let geojsonData = {
        "type": "FeatureCollection",
        "features": coordinates.map(coord => ({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coord
            },
            "properties": {
                "density": 1 // Set default density or use actual counts on aggregation
            }
        }))
    };

    // Create the map and add the marker layer
    createMap(geojsonData);
}

// Create the map
function createMap(geojsonData) {
    // Remove the existing map if already initialized
    if (myMap) {
        myMap.remove();
    }

    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create the map
    myMap = L.map("choropleth-map", {
        center: [20.0, 0.0], // Center the map on a global view
        zoom: 2, // Start with a zoom level that shows the world
        layers: [street] // Add the initial layer
    });

    // Add GeoJSON layer for meteorite coordinates
    L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 5,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`Meteorite Density: ${feature.properties.density}`);
        }
    }).addTo(myMap);

    // Create a layer control
    L.control.layers(baseMaps).addTo(myMap);
}