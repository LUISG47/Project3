const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

// Fetch and process the data
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract the rows of data
        const rows = data.data;

        console.log(rows);

        // Extract years from the dataset (assuming date is at index 14)
        const years = [...new Set(rows.map(row => {
            const date = new Date(row[14]);
            return date instanceof Date && !isNaN(date) ? date.getFullYear() : null;
        }).filter(year => year !== null))];

        console.log('Years:', years);

        // You can dynamically populate a dropdown or manually set a year
         
        const selectedYear = years[200]; // For example, take the first year

        // Filter meteorites based on selected year
        const filteredRows = rows.filter(row => new Date(row[14]).getFullYear() === selectedYear);

        // Sort meteorites by mass (assuming mass is at index 12) and get the top 10
        const biggestMeteorites = filteredRows
            .map(row => ({
                name: row[8], // Assuming the name is at index 8
                mass: parseFloat(row[12]) // Assuming the mass is at index 12
            }))
            .filter(meteorite => !isNaN(meteorite.mass)) // Ensure valid mass values
            .sort((a, b) => b.mass - a.mass) // Sort by mass in descending order
            .slice(0, 10); // Get the top 10 biggest meteorites

        console.log('Top 10 biggest meteorites:', biggestMeteorites);

        // Prepare data for the bubble chart
        const nameValues = biggestMeteorites.map(meteorite => meteorite.name);
        const massValues = biggestMeteorites.map(meteorite => meteorite.mass);

        const colorScale = 'Earth'; // Choose a color scale
        const colors = massValues; // Map mass values directly to color scale
        
        // Create the bubble chart trace
        const trace = {
          x: nameValues, // Names on the x-axis
          y: massValues, // Mass on the y-axis
          text: nameValues, // Tooltip text
          mode: 'markers',
          marker: {
              size: massValues.map(mass => {
                  // Use logarithm to scale mass values for better visualization
                  return mass ? Math.log(mass) * 10 : 0; // Multiply by 10 to scale the sizes
              }),
              color: colors, // Use mass values for color
              colorscale: colorScale, // Apply the color scale
              //colorbar: { title: 'Mass (g)' }, // Add color bar to indicate scale
              opacity: 0.6,
              line: {
                  width: 0.5,
                  color: 'earth'
              }
          }
      };

        // Data for the chart
        const chartData = [trace];

        // Layout configuration for the bubble chart
        const layout = {
            title: `Bubble Chart of Meteorites (Year: ${selectedYear})`,
            xaxis: {
                title: 'Meteorite Names',
                tickangle: -45 // Rotate x-axis labels for better visibility
            },
            yaxis: {
                title: 'Mass (g)'
            },
            showlegend: false
        };

        // Render the plot to the div with id "bubble"
        Plotly.newPlot('bubble', chartData, layout);
    })
    .catch(error => console.error('Error fetching data:', error));

    const yearSelect = document.getElementById('year-select');

