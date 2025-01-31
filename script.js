// NASA dataset URL
const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Fetch and process the data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract the rows of data
        const rows = data.data;

        // Find the index of the 'year' column
        const columns = data.meta.view.columns;
        const yearIndex = columns.findIndex(col => col.name === "year");

        // Extract years and convert them to numbers
        let years = rows.map(row => row[yearIndex])
                        .filter(year => year !== null) // Remove null values
                        .map(year => {
                            const match = year.match(/\d{4}/); // Extract only the year
                            return match ? parseInt(match[0]) : null;
                        })
                        .filter(year => year !== null); // Remove non-numeric values

        // Count the number of meteorites per year
        const yearCounts = {};
        years.forEach(year => {
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        });

        // Convert to arrays for Plotly
        const sortedYears = Object.keys(yearCounts).map(y => parseInt(y)).sort((a, b) => a - b);
        const counts = sortedYears.map(y => yearCounts[y]);

        // Filter for years 1800-present to improve readability
        const filteredYears = sortedYears.filter(year => year >= 1800);
        const filteredCounts = filteredYears.map(y => yearCounts[y]);

        // Create the bar chart with Plotly + Tooltips
        const trace = {
            x: filteredYears,
            y: filteredCounts,
            type: 'bar',
            marker: { color: 'orange', opacity: 0.8 }, // Default opacity
            hoverinfo: 'x+y', // Show Year + Meteorite Count
            hovertemplate: '<b>Year:</b> %{x}<br>' + // Display exact year
                           '<b>Meteorite Count:</b> %{y}<extra></extra>', // Show count
        };

        const layout = {
            title: '<b>Meteorite Falls Per Year</b>',
            xaxis: { title: 'Year', range: [1800, Math.max(...sortedYears)] },
            yaxis: { title: 'Meteorite Count', type: 'log' }, // Log scale to handle large numbers
            bargap: 0.1,
            hovermode: 'x', // Snap tooltip to closest bar
            hoverlabel: {
                bgcolor: "black", // Dark background
                font: { color: "white", size: 14 }, // White text
                bordercolor: "yellow" // Highlighted border
            }
        };

        Plotly.newPlot('chart', [trace], layout);
    })
    .catch(error => console.error("Error loading data:", error));


