// Store our API endpoint as queryUrl.
let queryUrl = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    console.log("Data fetched successfully:", data); // Log the fetched data
    createFeatures(data.data); // Access the rows in the "data" array
}).catch(error => {
    console.error("Error fetching data:", error);
});

// Function to determine the region of the meteorite based on coordinates
function getRegionByCoordinates(meteorite) {
    const latitude = parseFloat(meteorite[15]);
    const longitude = parseFloat(meteorite[16]);

    // Define regions based on revised geographical areas
    if (latitude >= 30.396308 && latitude <= 48.384358 && longitude >= -125.0 && longitude <= -66.93457) {
        // USA approximated bounds
        return "USA";  // Refined bounds for the contiguous United States
    }
    if (latitude >= 14.533333 && latitude <= 32.0 && longitude >= -118.0 && longitude < -86.0) {
        // Mexico boundaries
        return "Mexico"; // Bounds for Mexico
    }
    if (latitude >= 36.0 && latitude <= 71.0 && longitude >= -25 && longitude <= 45) {
        return "Europe"; // Rough bounds for Europe
    }
    if (latitude >= 1 && latitude <= 80 && longitude >= 60 && longitude <= 180) {
        return "Asia"; // Rough bounds for Asia
    }
    if (latitude >= -35 && latitude <= 37 && longitude >= 25 && longitude <= 60) {
        return "Africa"; // Approx. bounds for Africa
    }
    if (latitude >= -60 && latitude <= 15 && longitude >= -80 && longitude <= -35) {
        return "SouthAmerica"; // Rough bounds for South America
    }

    return ""; // Default for countries and regions not listed
}

// Function to create features on the map
function createFeatures(meteoriteData) {
    let filteredMeteorites = [];

    // Function to filter meteorites based on the selected region
    function filterMeteorites(selectedRegion) {
        filteredMeteorites = meteoriteData.filter(meteorite => {
            const isFound = meteorite[13] === "Found";
            const isInRegion = getRegionByCoordinates(meteorite);
            return isFound && (selectedRegion === "" || isInRegion === selectedRegion);
        })
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
        .slice(0, 2000); // Limit to the last 2000 meteorites

        console.log("Filtered Meteorites:", filteredMeteorites); // Log the filtered meteorites

        // Create markers for the filtered meteorites
        let meteoriteMarkers = filteredMeteorites.map(meteorite => {
            return L.marker([meteorite.latitude, meteorite.longitude])
                .bindPopup(`<h3>${meteorite.name}</h3><hr><p>Mass: ${meteorite.mass} grams<br>Date Found: ${meteorite.year.toLocaleDateString()}</p>`);
        });

        // Create a layer group made from the meteorite markers array
        let meteoriteLayerGroup = L.layerGroup(meteoriteMarkers);
        
        // Create or update the map with the filtered meteorites
        createMap(meteoriteLayerGroup);
    }

    // Add event listener for the dropdown menu
    document.getElementById('region-selector').addEventListener('change', function() {
        const selectedRegion = this.value;
        filterMeteorites(selectedRegion);
    });

    // Initial load: display all found meteorites
    filterMeteorites("");
}

// Variable global para el mapa
let myMap;

// Create the map
function createMap(meteorites) {
    // Elimina el mapa existente si ya ha sido inicializado
    if (myMap) {
        myMap.remove(); // Elimina el mapa existente
    }

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

    // Ahora crea el mapa solo si no existe
    myMap = L.map("map", {
        center: [20.0, 0.0], // Center the map on a global view
        zoom: 2, // Start with a zoom level that shows the world
        layers: [street, meteorites] // Add the initial layers
    });

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}
