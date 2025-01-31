// Fetch Meteorite Data from NASA API
const url = "https://data.nasa.gov/resource/gh4g-9sfh.json";

d3.json(url).then(data => {
    // Populate dropdown with meteorite names
    let dropdown = d3.select("#meteoriteDropdown");
    data.forEach(d => {
        dropdown.append("option").attr("value", d.id).text(d.name);
    });

    // Function to display meteorite info
    function updateInfo(id) {
        let meteorite = data.find(d => d.id === id);
        if (meteorite) {
            // Update Name, ID, Mass, Class
            d3.select("#name").text(meteorite.name || "N/A");
            d3.select("#id").text(meteorite.id || "N/A");
            d3.select("#mass").text(meteorite.mass || "Unknown");
            d3.select("#recclass").text(meteorite.recclass || "N/A");

            // Transform year into full date (Year, Month, Day)
            let date = meteorite.year ? new Date(meteorite.year) : null;
            if (date && !isNaN(date)) {
                let formattedDate = `Year: ${date.getFullYear()}, Month: ${date.getMonth() + 1}, Day: ${date.getDate()}`;
                d3.select("#year").text(formattedDate);
            } else {
                d3.select("#year").text("Date: Unknown");
            }
        }
    }

    // Update info on dropdown change
    dropdown.on("change", function() {
        let selectedId = this.value;
        updateInfo(selectedId);
    });

    // Initialize with first meteorite
    if (data.length > 0) {
        updateInfo(data[0].id);
    }
});
