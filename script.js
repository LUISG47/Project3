(function() {
    // NASA API URL
    const url = "https://data.nasa.gov/resource/gh4g-9sfh.json";

    const weightReferences = [
        { mass: 1000, image: "https://tinypic.host/images/2025/02/10/30.jpg", description: "a medium watermelon (1 kg)" },
        { mass: 5000, image: "https://tinypic.host/images/2025/02/10/CAT.jpg", description: "a cat (5 kg)" },
        { mass: 10000, image: "https://tinypic.host/images/2025/02/10/french-bulldog-dog-sitting-cut-out-2024-09-27-02-32-53-utc1.jpg", description: "a medium dog (10 kg)" },
        { mass: 50000, image: "https://tinypic.host/images/2025/02/10/washing-machine-2023-11-27-05-33-38-utc-1.jpg", description: "a small washing machine (50 kg)" },
        { mass: 100000, image: "https://tinypic.host/images/2025/02/10/motor.jpg", description: "a vehicle motor (100 kg)" },
        { mass: 200000, image: "https://tinypic.host/images/2025/02/10/IMG_6362.jpeg", description: "a motorcycle with side car (200 kg)" },
        { mass: 300000, image: "https://tinypic.host/images/2025/02/10/snacks-coldrinks-vending-machine.png", description: "a vending machine (300 kg)" },
        { mass: 400000, image: "https://tinypic.host/images/2025/02/10/LION.jpg", description: "a full-grown lion (400 kg)" },
        { mass: 500000, image: "https://tinypic.host/image/Baby-African-elephant-Addo-Elephant-National-Park.2p9zVM", description: "a small elephant (500 kg)" },
        { mass: 600000, image: "https://tinypic.host/images/2025/02/10/heavy.jpg", description: "a draft horse (600 kg)" },
        { mass: 700000, image: "https://tinypic.host/images/2025/02/10/young.jpg", description: "a white rhinoceros (700 kg)" },
        { mass: 800000, image: "https://tinypic.host/images/2025/02/10/beaut.jpg", description: "a large bison (800 kg)" },
        { mass: 900000, image: "https://tinypic.host/image/SS.2p9TWE", description: "a walrus (900 kg)" },
        { mass: 1000000, image: "https://tinypic.host/image/Hippo-%28Hippopotamus-amphibius%29.2p9pa5", description: "a hippo (1,000 kg)" },
        { mass: 2000000, image: "https://images.pexels.com/photos/892894/pexels-photo-892894.jpeg", description: "a shipping container (2,000 kg)" },
        { mass: 3000000, image: "https://images.pexels.com/photos/1519702/pexels-photo-1519702.jpeg", description: "a mid-size truck (3,000 kg)" },
        { mass: 4000000, image: "https://images.pexels.com/photos/1437691/pexels-photo-1437691.jpeg", description: "a bus (4,000 kg)" },
        { mass: 5000000, image: "https://images.pexels.com/photos/943366/pexels-photo-943366.jpeg", description: "a limousine (5,000 kg)" },
        { mass: 6000000, image: "https://images.pexels.com/photos/4109019/pexels-photo-4109019.jpeg", description: "a cargo truck (6,000 kg)" },
        { mass: 7000000, image: "https://images.pexels.com/photos/1655263/pexels-photo-1655263.jpeg", description: "a large freight truck (7,000 kg)" },
        { mass: 8000000, image: "https://images.pexels.com/photos/37021/pexels-photo.jpg", description: "a Boeing 737 (8,000 kg)" },
        { mass: 9000000, image: "https://images.pexels.com/photos/414048/pexels-photo-414048.jpeg", description: "a small yacht (9,000 kg)" },
        { mass: 10000000, image: "https://images.pexels.com/photos/186034/pexels-photo-186034.jpeg", description: "a large commercial airplane (10,000 kg)" },
        { mass: 15000000, image: "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg", description: "a small cargo ship (15,000 kg)" },
        { mass: 20000000, image: "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg", description: "a medium-sized cargo ship (20,000 kg)" },
        { mass: 25000000, image: "https://images.pexels.com/photos/163186/pexels-photo-163186.jpeg", description: "a large cargo vessel (25,000 kg)" },
        { mass: 30000000, image: "https://images.pexels.com/photos/163186/pexels-photo-163186.jpeg", description: "a container ship (30,000 kg)" },
        { mass: 35000000, image: "https://images.pexels.com/photos/6216380/pexels-photo-6216380.jpeg", description: "a very large ship (35,000 kg)" },
        { mass: 40000000, image: "https://images.pexels.com/photos/6216380/pexels-photo-6216380.jpeg", description: "a large fishing vessel (40,000 kg)" },
        { mass: 45000000, image: "https://images.pexels.com/photos/8435681/pexels-photo-8435681.jpeg", description: "a large container ship (45,000 kg)" },
        { mass: 50000000, image: "https://images.pexels.com/photos/8435681/pexels-photo-8435681.jpeg", description: "a large cargo ship (50,000 kg)" },
        { mass: 55000000, image: "https://images.pexels.com/photos/6082998/pexels-photo-6082998.jpeg", description: "a large freight transport ship (55,000 kg)" },
        { mass: 60000000, image: "https://images.pexels.com/photos/6082998/pexels-photo-6082998.jpeg", description: "a large oil tanker (60,000 kg)" }
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
                // Extract the year directly as a numeric value
                let year = meteorite.year ? new Date(meteorite.year).getFullYear() : null;
                if (year) {
                    d3.select("#year").text(`${year}`);
                } else {
                    d3.select("#year").text("Unknown");
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