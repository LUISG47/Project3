const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Fetch and process the data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract the rows of data
        const rows = data.data;

        console.log(rows);

        // Count how many meteorites exist for each year
        const yearCounts = rows.reduce((acc, row) => {
            const date = new Date(row[14]);
            const year = date.getFullYear();
            if (year >= 1850) { // Only include years from 1850 onwards
                acc[year] = (acc[year] || 0) + 1;
            }
            return acc;
        }, {});

        // Extract years that have meteorites (exclude years with 0 meteorites)
        const years = Object.keys(yearCounts).filter(year => yearCounts[year] > 0).sort((a, b) => a - b);

        console.log('Available Years with data:', years);

        // Create year dropdown dynamically
        const yearDropdown = document.createElement("select");
        yearDropdown.id = "yearSelector";
        yearDropdown.classList.add('form-select', 'mb-3');

        // Populate the yearDropdown with years, starting from 1850
        years.forEach(year => {
            let option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        });

        // Set the default selected year to 1975
        yearDropdown.value = "1975"; // Ensure 1975 is selected by default

        // Make sure to target the correct card body to insert the yearDropdown
        const meteoriteCardBody = document.querySelector('.card-body');

        // Select the h3 to insert the dropdown after it
        const header = meteoriteCardBody.querySelector('h3');

        // Insert the dropdown after the header
        header.insertAdjacentElement('afterend', yearDropdown);

        // Function to update the chart based on the selected year
        function updateChart(selectedYear) {
            const filteredRows = rows.filter(row => new Date(row[14]).getFullYear() === parseInt(selectedYear));
            
            // Sort meteorites by mass and get the top 25
            const biggestMeteorites = filteredRows
                .map(row => ({
                    name: row[8], // Meteorite name
                    mass: parseFloat(row[12]), // Mass value
                    locationLat: row[15], // Location Latitude (row[15])
                    locationLong: row[16] // Location Longitude (row[16])
                }))
                .filter(meteorite => !isNaN(meteorite.mass)) // Ensure valid mass values
                .sort((a, b) => b.mass - a.mass) // Sort by mass (descending order)
                .slice(0, 25); // Top 25 biggest meteorites

            console.log('Top 25 biggest meteorites for year', selectedYear, biggestMeteorites);
            // Prepare data for the bubble chart
            const nameValues = biggestMeteorites.map(meteorite => meteorite.name);
            const massValues = biggestMeteorites.map(meteorite => meteorite.mass);
            const locationValues = biggestMeteorites.map(meteorite => 
                `Lat: ${meteorite.locationLat}, Long: ${meteorite.locationLong}`
            );

            // Create the bubble chart trace
            const trace = {
                x: nameValues,
                y: massValues,
                text: locationValues, // Location information for hover
                mode: 'markers',
                marker: {
                    size: massValues.map(mass => mass ? Math.log(mass) * 10 : 0), // Scale mass sizes
                    color: massValues,
                    colorscale: 'Earth',
                    opacity: 0.6,
                    line: { width: 0.5, color: 'black' }
                },
                hovertemplate: [
                    '%{text}', // Display location (Lat/Long)
                    'Mass: %{y}g', // Display mass in the y-axis
                    '<extra></extra>', // Optional, remove extra info
                ].join('<br>'),
            };

            // Chart layout
            const layout = {
                title: `Bubble Chart of Meteorites (Year: ${selectedYear})`,
                xaxis: { title: 'Meteorite Names', tickangle: -45 },
                yaxis: { title: 'Mass (g)' },
                showlegend: false
            };

            // Render the chart
            Plotly.newPlot('bubble', [trace], layout);
        }

        // Event listener to update the chart when the dropdown value changes
        yearDropdown.addEventListener("change", function() {
            updateChart(this.value);
        });

        // Initialize chart with the first available year, ensuring default is set to 1975
        updateChart(yearDropdown.value); // This will use the pre-selected year (1975)
    })
    .catch(error => console.error('Error fetching data:', error));