//------------------------------------------------------------------------------------------------------------------------------------------------//
// THIS CODE IS FOR THE LOCATION OF YOUR OWN METEORITE DEPENDING ON YOUR BIRTH DATE AND NAME
//------------------------------------------------------------------------------------------------------------------------------------------------//


(async function() {
    // NASA dataset URL
    const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";
    const geocodeAPI = "https://api.opencagedata.com/geocode/v1/json"; // OpenCage Geocoding API URL
    const apiKey = "5e76199d6fe9422eb01a468b126a9c52"; // Replace with your OpenCage API key

    // Initialize a global variable for the map
    let mapInitialized = false;
    let mnameMap; // Changed variable name to mnameMap

    try {
        // Fetch and process the meteorite data
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.data;

        // When the submit button is clicked
        document.getElementById("submitBtn").addEventListener("click", function() {
            const nameInput = document.getElementById("nameInput").value.toLowerCase();
            const yearInput = parseInt(document.getElementById("yearInput").value);

            // Attempt to find the corresponding meteorite
            const matchedMeteorite = findMeteorite(nameInput, yearInput, rows);

            if (matchedMeteorite) {
                displayResult(matchedMeteorite);
                addMarker(matchedMeteorite.location.latitude, matchedMeteorite.location.longitude); // Add the marker to the map
            } else {
                alert("No matching meteorite found!");
            }
        });
        
        // Initialize the map only once
        if (!mapInitialized) {
            mnameMap = L.map('mnameMap').setView([0, 0], 2); // Initialize map at a default location

            // Add the light map layer
            let lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mnameMap); // Use the new variable name
            
            mapInitialized = true; // Set map as initialized
        }
        //-------------------------------------------------------------------------------------------------------------------------// 
        //  FUNCTION TO FIND THE METEORITE
        //-------------------------------------------------------------------------------------------------------------------------// 
        function findMeteorite(userName, userYear, rows) {
            let closestMeteorite = null;
            let closestMatchCount = 0;

            rows.forEach(row => {
                const mass = parseFloat(row[12]); // Mass at index 12
                const name = row[8].toLowerCase(); // Name at index 8
                const dateStr = row[14]; // Date at index 14
                const year = new Date(dateStr).getFullYear(); // Extract year from date
                const latitude = row[15]; // Latitude at index 15
                const longitude = row[16]; // Longitude at index 16

                // Check for matching year
                if (year === userYear && mass !== null) {
                    const matchCount = countMatchingLetters(name, userName);

                    if (matchCount > closestMatchCount) {
                        closestMatchCount = matchCount;
                        closestMeteorite = {
                            name: row[8], // Meteorite name
                            mass: mass, // Mass
                            location: { latitude: latitude, longitude: longitude }, // Location
                            year: year // Year it fell
                        };
                    }
                }
            });

            return closestMeteorite;
        }

        //-------------------------------------------------------------------------------------------------------------------------// 
        //FUNCTION TO COUNT MATCH LETTERS
        //-------------------------------------------------------------------------------------------------------------------------// 
        function countMatchingLetters(meteoriteName, userName) {
            let normalizedMeteoriteName = meteoriteName.replace(/[^a-z]/g, ''); // Remove non-alpha characters
            const normalizedUserName = userName.replace(/[^a-z]/g, ''); // Remove non-alpha characters
            let matchCount = 0;

            // Count matching letters
            for (let char of normalizedUserName) {
                if (normalizedMeteoriteName.includes(char)) {
                    matchCount++;
                    normalizedMeteoriteName = normalizedMeteoriteName.replace(char, ''); // Remove the matched character
                }
            }

            return matchCount;
        }
        function displayResult(meteorite) {
            document.getElementById("meteoriteName").innerText = `Name: ${meteorite.name}`;
            document.getElementById("meteoriteMass").innerText = `Mass: ${meteorite.mass} kg`;
            document.getElementById("meteoriteYear").innerText = `Year: ${meteorite.year}`;
            
            // Show latitude and longitude
            document.getElementById("meteoriteLocation").innerText = `Location: Lat: ${meteorite.location.latitude}, Long: ${meteorite.location.longitude}`;

            // Get country and city from latitude and longitude
            getCountryCity(meteorite.location.latitude, meteorite.location.longitude).then(location => {
                document.getElementById("meteoriteCountryCity").innerText = `Location: ${location.city}, ${location.country}`;
                
                // Show the result
                document.getElementById("result").style.display = "block"; // Show result
                
                // Add marker to the map
                addMarker(meteorite.location.latitude, meteorite.location.longitude); // Add the marker to the map
            });
        }
        //-------------------------------------------------------------------------------------------------------------------------// 
        //FUNCTION TO GET COUNTRY AND CITY WITH THE API CONNECTION
        //-------------------------------------------------------------------------------------------------------------------------// 
        async function getCountryCity(lat, long) {
            const response = await fetch(`${geocodeAPI}?q=${lat},${long}&key=${apiKey}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                return {
                    city: location.components.city || location.components.town || "Unknown City",
                    country: location.components.country || "Unknown Country"
                };
            } else {
                return { city: "Unknown City", country: "Unknown Country" };
            }
        }

        function addMarker(latitude, longitude) {
            // Create a marker on the map at the specified coordinates
            const marker = L.marker([latitude, longitude]).addTo(mnameMap);
            mnameMap.setView([latitude, longitude], 4); // Set zoom to show continental view
        }


        // Add an event listener for the CLEAR button
    document.getElementById("clearBtn").addEventListener("click", function() {
        clearSelections();
    });

    //--------------------------------------------------------------------------------------------------// 
    // Function to clear selections and results
    //--------------------------------------------------------------------------------------------------// 
    function clearSelections() {
        // Clear input fields
        document.getElementById("nameInput").value = '';
        document.getElementById("yearInput").value = '';

        // Clear displayed results
        document.getElementById("meteoriteName").innerText = '';
        document.getElementById("meteoriteMass").innerText = '';
        document.getElementById("meteoriteYear").innerText = '';
        document.getElementById("meteoriteLocation").innerText = '';
        document.getElementById("meteoriteCountryCity").innerText = '';

        // Hide the result section
        document.getElementById("result").style.display = "none";

        // Optionally, remove markers from the map
        mnameMap.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                mnameMap.removeLayer(layer);
            }
        });

        // Reset the map view or any particular state as needed
        mnameMap.setView([0, 0], 2); // Reset the map to a default location
    }


    } catch (error) {
        console.error("Error loading data:", error);
    }
})();