// Store our API endpoint as queryUrl.
let choroplethQueryUrl = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Perform a GET request to the query URL
d3.json(choroplethQueryUrl).then(function(data) {
    console.log("Data fetched successfully:", data); // Log the fetched data
    createChoroplethMap(data.data); // Create the choropleth map
}).catch(error => {
    console.error("Error fetching data:", error);
});

// Function to create a choropleth map showing individual meteorite masses
function createChoroplethMap(meteoriteData) {
    // Initialize the map
    myMap = L.map("choropleth-map", {
        center: [20.0, 0.0], // Center the map on a global view
        zoom: 2 // Start with a zoom level that shows the world
    });

    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    let lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Add the layers to the map
    darkMap.addTo(myMap); // Set default layer as street view

    // Add meteorite markers
    meteoriteData.forEach(meteorite => {
        if (meteorite[13] === "Found") {
            const latitude = parseFloat(meteorite[15]);
            const longitude = parseFloat(meteorite[16]);
            const mass = parseFloat(meteorite[12]); // Mass in grams

            if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(mass)) {
                L.circleMarker([latitude, longitude], {
                    radius: Math.sqrt(mass) / 100, // Adjust size based on mass
                    fillColor: getColor(mass), // Color based on mass
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(myMap)
                .bindPopup(`Mass: ${mass} grams`);
            }
        }
    });

    // Add a layer control to switch between base maps
    L.control.layers({
        "Street Map": street,
        "Dark Map": darkMap,
        "Light Map": lightMap
    }).addTo(myMap);
}

// Function to get color based on meteorite mass (for the legend)
function getColor(mass) {
    return mass > 20000 ? '#800026' :
           mass > 10000  ? '#BD0026' :
           mass > 5000   ? '#E31A1C' :
           mass > 1000   ? '#FC4E2A' :
           mass > 100    ? '#FD8D3C' :
           mass > 1      ? '#FEB24C' :
                           '#FFEDA0';
}