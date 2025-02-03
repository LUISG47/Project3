// Store our API endpoint as queryUrl.
let queryUrl = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    console.log("Data fetched successfully:", data); // Log the fetched data
    createFeatures(data.data); // Access the rows in the "data" array
}).catch(error => {
    console.error("Error fetching data:", error);
});

// Function to create features on the map
function createFeatures(meteoriteData) {
    // Filter and sort the meteorite data based on the fall status being "Found"
    let filteredMeteorites = meteoriteData.filter(meteorite => meteorite[13] === "Found")
        .map(meteorite => {
            return {
                name: meteorite[8], // Meteorite name
                mass: meteorite[11], // Mass in grams 
                fall: meteorite[12], // Fall status
                year: new Date(meteorite[14]), // Convert string to Date object for the found date
                longitude: parseFloat(meteorite[16]), // Longitude
                latitude: parseFloat(meteorite[15]) // Latitude
            };
        })
        .sort((a, b) => b.year - a.year) // Sort by year (most recent first)
        .slice(0, 2000); // Limit to the last 300 meteorites

    console.log("Filtered Meteorites:", filteredMeteorites); // Log the filtered meteorites

    // Create markers for meteorites
    let meteoriteMarkers = filteredMeteorites.map(meteorite => {
        return L.marker([meteorite.latitude, meteorite.longitude])
            .bindPopup(`<h3>${meteorite.name}</h3><hr><p>Mass: ${meteorite.mass} grams<br>Date Found: ${meteorite.year.toLocaleDateString()}</p>`);
    });

    // Create a layer group made from the meteorite markers array
    let meteoriteLayerGroup = L.layerGroup(meteoriteMarkers);
    
    // Send our meteorites layer to the createMap function
    createMap(meteoriteLayerGroup);
}

// Create the map
function createMap(meteorites) {
    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    let lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Dark Map": darkMap,
        "Light Map": lightMap
    };

    // Create an overlay object to hold our meteorites layer
    let overlayMaps = {
        Meteorites: meteorites // Reference to the meteorites layer
    };

    // Create our map, giving it the streetmap and meteorites layers to display on load
    let myMap = L.map("map", {
        center: [20.0, 0.0], // Center the map on a global view
        zoom: 2, // Start with a zoom level that shows the world
        layers: [street, meteorites] // Add the initial layers
    });

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}