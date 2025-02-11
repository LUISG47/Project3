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
            const name = meteorite[8]; // Assuming the name is in the 0th index
            const year = new Date(meteorite[14]).getFullYear(); // Convert to Date object and extract the year

            if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(mass)) {
                L.circleMarker([latitude, longitude], {
                    radius: Math.sqrt(mass) / 100, // Adjust size based on mass
                    fillColor: getColor(mass), // Color based on mass
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(myMap)
                .bindPopup(`
                    <strong>Name:</strong> ${name}<br>
                    <strong>Year:</strong> ${year}<br>
                    <strong>Mass:</strong> ${mass} grams
                `);
            }
        }
    });

    // Add a layer control to switch between base maps
    L.control.layers({
        "Street Map": street,
        "Dark Map": darkMap,
        "Light Map": lightMap
    }).addTo(myMap);

    addLegend();
}

// Function to get color based on meteorite mass (for the legend)
function getColor(mass) {
    return mass > 2000000 ? '#800026' :
           mass > 1000000  ? '#A62024' :
           mass > 500000   ? '#BD0026' :
           mass > 100000   ? '#C82A12' :
           mass > 10000    ? '#E03A13' :
           mass > 100      ? '#D74A1A' :
                           '#F57C20';
}


// Function to add a legend to the map
function addLegend() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        
        // Set styles for the legend
        div.style.backgroundColor = '#cccccc'; // Set background color to a darker gray
        div.style.padding = '10px'; // Add some padding
        div.style.borderRadius = '5px'; // Round the corners
        div.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)'; // Add a slight shadow for depth

        // Adjust position to move the legend up by approximately 5 cm
        div.style.marginBottom = '75px'; // Increase to move up further

        // Add title to the legend
        div.innerHTML += '<strong>Mass in grams</strong><br><br>'; // Title with a line break

        const grades = [
            0,          // No mass
            100,        // 100 grams
            10_000,     // 10,000 grams
            100_000,    // 100,000 grams
            500_000,    // 500,000 grams
            1_000_000,  // 1,000,000 grams
            2_000_000   // 2,000,000 grams
        ]; // Define the mass ranges

        // Add each color to the legend
        for (let i = 0; i < grades.length; i++) {
            const color = getColor(grades[i] + 1); // Get the color for the next range
            div.innerHTML +=
                '<i style="background:' + color + '; width: 20px; height: 20px; display: inline-block;"></i> ' + // Use the color from getColor
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap); // Append the legend to the map
}