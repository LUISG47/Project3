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

        // Create the bar chart with Plotly
        const trace = {
            x: filteredYears,
            y: filteredCounts,
            type: 'bar',
            marker: { color: 'orange' } // Better visibility
        };

        const layout = {
            title: '<b>Meteorite Falls Per Year</b>',
            xaxis: { title: 'Year', range: [1800, Math.max(...sortedYears)] }, // Focus on recent data
            yaxis: { title: 'Meteorite Count', type: 'log' }, // Log scale to handle large numbers
            bargap: 0.1
        };

        Plotly.newPlot('chart', [trace], layout);
    })
    .catch(error => console.error("Error loading data:", error));



