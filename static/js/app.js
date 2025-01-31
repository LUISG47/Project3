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
                mass: meteorite[12], // Mass in grams 
                year: new Date(meteorite[14]), // Convert string to Date object for the found date
                
            };
        })
        .sort((a, b) => b.year - a.year) // Sort by year (most recent first)
        .slice(0, 10); // Limit to the last 300 meteorites

    console.log("Filtered Meteorites:", filteredMeteorites); // Log the filtered meteorites


    // Build a Bubble Chart
    const bubbleTrace = {
      x: name,
      y: mass,
      text: "Meteorite Mass",
      mode: 'markers',
      marker: {
        size: mass,
        color: name,
        colorscale: 'Earth'
      }
    };

    // Render the Bubble Chart

    const bubbleData = [bubbleTrace];
    
    const bubbleLayout = {
      title: 'Meteorites Mass per Year',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Mass' },
      hovermode: 'largest'
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

};





// Function to run on page load
function init() {
  d3.json(queryUrl).then((data) => {

    // Get the names field
    const sNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sNames[0];
    console.log(firstSample)
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
