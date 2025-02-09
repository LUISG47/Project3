(function() {
    // NASA API URL
    const url = "https://data.nasa.gov/resource/gh4g-9sfh.json";

    const weightReferences = [
        { mass: 1000, image: "https://images.pexels.com/photos/248280/pexels-photo-248280.jpeg", description: "a medium watermelon (1 kg)" },
        { mass: 5000, image: "https://images.pexels.com/photos/1586635/pexels-photo-1586635.jpeg", description: "a large dog (5 kg)" },
        { mass: 10000, image: "https://images.pexels.com/photos/4125174/pexels-photo-4125174.jpeg", description: "a small bag of flour (10 kg)" },
        { mass: 50000, image: "https://images.pexels.com/photos/1063605/pexels-photo-1063605.jpg", description: "a large suitcase (50 kg)" },
        { mass: 100000, image: "https://images.pexels.com/photos/2041621/pexels-photo-2041621.jpeg", description: "a refrigerator (100 kg)" },
        { mass: 200000, image: "https://images.pexels.com/photos/2740535/pexels-photo-2740535.jpeg", description: "a compact car (200 kg)" },
        { mass: 300000, image: "https://images.pexels.com/photos/2272155/pexels-photo-2272155.jpeg", description: "a motorcycle (300 kg)" },
        { mass: 400000, image: "https://images.pexels.com/photos/1108290/pexels-photo-1108290.jpeg", description: "a full-grown lion (400 kg)" },
        { mass: 500000, image: "https://images.pexels.com/photos/2386530/pexels-photo-2386530.jpeg", description: "a small elephant (500 kg)" },
        { mass: 600000, image: "https://images.pexels.com/photos/1886672/pexels-photo-1886672.jpeg", description: "a heavy armored vehicle (600 kg)" },
        { mass: 700000, image: "https://images.pexels.com/photos/128028/pexels-photo-128028.jpeg", description: "a white rhinoceros (700 kg)" },
        { mass: 800000, image: "https://images.pexels.com/photos/1048273/pexels-photo-1048273.jpeg", description: "a large bison (800 kg)" },
        { mass: 900000, image: "https://images.pexels.com/photos/2675939/pexels-photo-2675939.jpeg", description: "a walrus (900 kg)" },
        { mass: 1000000, image: "https://images.pexels.com/photos/1628210/pexels-photo-1628210.jpeg", description: "a hippo (1,000 kg)" },
        { mass: 2000000, image: "https://images.pexels.com/photos/892894/pexels-photo-892894.jpeg", description: "a small car (2,000 kg)" },
        { mass: 3000000, image: "https://images.pexels.com/photos/1519702/pexels-photo-1519702.jpeg", description: "a mid-size truck (3,000 kg)" },
        { mass: 4000000, image: "https://images.pexels.com/photos/1437691/pexels-photo-1437691.jpeg", description: "a bus (4,000 kg)" },
        { mass: 5000000, image: "https://images.pexels.com/photos/943366/pexels-photo-943366.jpeg", description: "a limousine (5,000 kg)" },
        { mass: 6000000, image: "https://images.pexels.com/photos/4109019/pexels-photo-4109019.jpeg", description: "a cargo truck (6,000 kg)" },
        { mass: 7000000, image: "https://images.pexels.com/photos/1655263/pexels-photo-1655263.jpeg", description: "a large freight truck (7,000 kg)" },
        { mass: 8000000, image: "https://images.pexels.com/photos/37021/pexels-photo.jpg", description: "a Boeing 737 (8,000 kg)" },
        { mass: 9000000, image: "https://images.pexels.com/photos/414048/pexels-photo-414048.jpeg", description: "a small yacht (9,000 kg)" },
        { mass: 10000000, image: "https://images.pexels.com/photos/186034/pexels-photo-186034.jpeg", description: "a large commercial airplane (10,000 kg)" }
];

    // Fetch Meteorite Data from NASA API
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

                // Show weight comparison
                let mass = parseFloat(meteorite.mass) || 0; // Convert mass to number
                let reference = weightReferences.find(ref => mass <= ref.mass) || weightReferences[weightReferences.length - 1];

                // Update the comparison element
                d3.select("#weightComparison")
                  .html(`Your meteorite is as heavy as: <strong>${reference.description}</strong><br>
                         <img src="${reference.image}" alt="Comparison image" style="width:150px; height:auto;">`);
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
    }).catch(error => console.error("Error fetching meteorite data:", error));
})();