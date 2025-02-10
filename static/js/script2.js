(function() {
    // NASA dataset URL
    const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

    // Fetch and process the data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the rows of data
            const rows = data.data;

            // Find the index of the 'year' and 'name' columns
            const columns = data.meta.view.columns;
            const yearIndex = columns.findIndex(col => col.name === "year");
            const nameIndex = columns.findIndex(col => col.name === "name");

            // Extract years and convert them to numbers, excluding the year 2101 and specific meteorite name
            let years = rows.map(row => {
                const year = row[yearIndex];
                const meteoriteName = row[nameIndex];

                // Exclude year 2101 and name "Northwest Africa 7701"
                return (year !== null && year !== 2101 && meteoriteName !== "Northwest Africa 7701") 
                       ? parseInt(year) 
                       : null;
            }).filter(year => year !== null); // Remove null values

            // Count the number of meteorites per year
            const yearCounts = {};
            years.forEach(year => {
                if (year >= 1800) { // Only count years from 1800
                    yearCounts[year] = (yearCounts[year] || 0) + 1;
                }
            });

            // Convert to arrays for Plotly
            const sortedYears = Object.keys(yearCounts).map(y => parseInt(y)).sort((a, b) => a - b);
            const counts = sortedYears.map(y => yearCounts[y]);

            // Calculate colors based on counts (from ORANGE to burgundy)
            const maxCount = Math.max(...counts);
            const interpolateColor = (start, end, factor) => {
                const result = start.slice();
                for (let i = 0; i < start.length; ++i) {
                    result[i] = Math.round(start[i] + factor * (end[i] - start[i]));
                }
                return result;
            };

            const hexToRgb = hex => {
                const bigint = parseInt(hex.slice(1), 16);
                return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
            };

            const startColor = hexToRgb('#ffa500'); // Yellow
            const endColor = hexToRgb('#800020');   // Burgundy

            const colors = counts.map(count => {
                const intensity = Math.pow(count / maxCount, 0.27); // Usar un exponente mayor para más cambio
                const rgb = interpolateColor(startColor, endColor, intensity);
                return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            });

            // Create the bar chart with Plotly + Tooltips
            const trace = {
                x: sortedYears,
                y: counts,
                type: 'bar',
                marker: {
                    color: colors
                },
                hoverinfo: 'x+y', // Show Year + Meteorite Count
                hovertemplate: '<b>Year:</b> %{x}<br>' + // Display exact year
                               '<b>Meteorite Count:</b> %{y}<extra></extra>', // Show count
            };

            const layout = {
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
})();