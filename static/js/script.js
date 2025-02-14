
//------------------------------------------------------------------------------------------------------------------------------------------------//
// THIS CODE WILL CREATE THE INFO WINDOW WITH METEORITE CHARACTERISTICS ON THE DASHBOARD SECTION
//------------------------------------------------------------------------------------------------------------------------------------------------//


(async function() {
    // NASA API URL
    const url = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";

    //--------------------------------------------------------------------------------
    // CREATION OF THE IMAGE DATABASE FROM https://www.envato.com
    // All the images were purchased for the use of the app
    //--------------------------------------------------------------------------------
    const weightReferences = [
        { mass: 1000, image: "https://tinypic.host/images/2025/02/10/30.jpg", description: "a medium watermelon (1 kg)" },
        { mass: 5000, image: "https://tinypic.host/images/2025/02/10/CAT.jpg", description: "a cat (5 kg)" },
        { mass: 10000, image: "https://tinypic.host/images/2025/02/10/french-bulldog-dog-sitting-cut-out-2024-09-27-02-32-53-utc1.jpg", description: "a medium dog (10 kg)" },
        { mass: 25000, image: "https://tinypic.host/images/2025/02/11/silver.jpg", description: "a medium-size suitcase (25 kg)" },
        { mass: 50000, image: "https://tinypic.host/images/2025/02/10/washing-machine-2023-11-27-05-33-38-utc-1.jpg", description: "a small washing machine (50 kg)" },
        { mass: 75000, image: "https://tinypic.host/images/2025/02/11/yy.jpg", description: "the weight of an average adult man(75 kg)" },
        { mass: 100000, image: "https://tinypic.host/images/2025/02/11/weber-copia.jpg", description: "an upright piano(100 kg)" },
        { mass: 200000, image: "https://tinypic.host/images/2025/02/10/IMG_6362.jpeg", description: "a motorcycle with side car (200 kg)" },
        { mass: 300000, image: "https://tinypic.host/images/2025/02/10/snacks-coldrinks-vending-machine.png", description: "a vending machine (300 kg)" },
        { mass: 400000, image: "https://tinypic.host/images/2025/02/10/LION.jpg", description: "a full-grown lion (400 kg)" },
        { mass: 500000, image: "https://tinypic.host/images/2025/02/12/baby.jpg", description: "a small elephant (500 kg)" },
        { mass: 600000, image: "https://tinypic.host/images/2025/02/10/heavy.jpg", description: "a draft horse (600 kg)" },
        { mass: 700000, image: "https://tinypic.host/images/2025/02/10/young.jpg", description: "a white rhinoceros (700 kg)" },
        { mass: 800000, image: "https://tinypic.host/images/2025/02/10/beaut.jpg", description: "a large bison (800 kg)" },
        { mass: 900000, image: "https://tinypic.host/images/2025/02/10/SS.jpg", description: "a walrus (900 kg)" },
        { mass: 1000000, image: "https://tinypic.host/images/2025/02/12/2HIP1.jpg", description: "a hippo (1,000 kg)" },
        { mass: 2000000, image: "https://tinypic.host/images/2025/02/12/AERIAL1.jpg", description: "a shipping container (2,000 kg)" },
        { mass: 3000000, image: "https://tinypic.host/images/2025/02/11/jeep.jpg", description: "a mid-size truck (3,000 kg)" },
        { mass: 4000000, image: "https://tinypic.host/images/2025/02/11/bus.jpg", description: "a bus (4,000 kg)" },
        { mass: 5000000, image: "https://tinypic.host/images/2025/02/11/LIM.webp", description: "a limousine (5,000 kg)" },
        { mass: 6000000, image: "https://tinypic.host/images/2025/02/11/SEMI.jpg", description: "a cargo truck (6,000 kg)" },
        { mass: 7000000, image: "https://tinypic.host/images/2025/02/11/truckk.jpg", description: "a large freight truck (7,000 kg)" },
        { mass: 8000000, image: "https://tinypic.host/images/2025/02/11/full.jpg", description: "a Boeing 737 (8,000 kg)" },
        { mass: 9000000, image: "https://tinypic.host/images/2025/02/12/SMALL.jpeg", description: "a small yacht (9,000 kg)" },
        { mass: 10000000, image: "https://tinypic.host/images/2025/02/11/air2.jpg", description: "a large commercial airplane (10,000 kg)" },
        { mass: 15000000, image: "https://tinypic.host/images/2025/02/11/alit.jpg", description: "a small cargo ship (15,000 kg)" },
        { mass: 20000000, image: "https://tinypic.host/images/2025/02/11/bull.jpg", description: "a bulldozer (20,000 kg)" },
        { mass: 25000000, image: "https://tinypic.host/images/2025/02/11/2dri.jpg", description: "a fully loaded city bus (25,000 kg)" },
        { mass: 30000000, image: "https://tinypic.host/images/2025/02/12/larg21.jpg", description: "large concrete mixer truck (30,000 kg)" },
        { mass: 35000000, image: "https://tinypic.host/images/2025/02/11/low.jpg", description: "a very large yatch (35,000 kg)" },
        { mass: 40000000, image: "https://tinypic.host/images/2025/02/11/MIL.jpg", description: "a light tank(40,000 kg)" },
        { mass: 45000000, image: "https://tinypic.host/images/2025/02/11/AERIAL.jpg", description: "a large container ship (45,000 kg)" },
        { mass: 50000000, image: "https://tinypic.host/image/towe.2pAASm", description: "a tower crane (50,000 kg)" },
        { mass: 55000000, image: "https://tinypic.host/images/2025/02/11/Screenshot-2025-02-10-at-10.21.03p.m..png", description: "a large freight transport ship (55,000 kg)" },
        { mass: 60000000, image: "https://tinypic.host/images/2025/02/11/AER.jpg", description: "a large oil tanker (60,000 kg)" }
    ];

    try {
        // Fetch Meteorite Data from NASA API
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json(); // Obtener el JSON
        console.log(data); // Verifica la estructura

        // Asegúrate de que los meteoritos están en 'data.data'
        const meteorites = data.data; // Cambia esto si la estructura es diferente

        // Populate dropdown with unique meteorite names
        let dropdown = d3.select("#meteoriteDropdown");
        let seenNames = new Set(); // Para almacenar nombres únicos

        meteorites.forEach(meteorite => {
            let fullName = meteorite[8]; // Obtener el nombre completo del meteorito
            // Utilizar una expresión regular para obtener solo el nombre base
            let baseName = fullName.replace(/\s+\w+$/, ''); // Elimina cualquier espacio y caracteres que sigan

            if (!seenNames.has(baseName)) { // Comprobar si el nombre base ya se ha visto
                seenNames.add(baseName); // Añadir el nombre base al conjunto
                dropdown.append("option")
                    .attr("value", meteorite[9]) // Usar índice correcto para ID
                    .text(baseName); // Usar el nombre base
            }
        });

        function updateInfo(id) {
            let meteorite = meteorites.find(m => m[9] === id); // Buscar en el array de meteoritos
            
            if (meteorite) {
                // Actualizar Nombre, ID, Masa, Clase
                d3.select("#name").text(meteorite[8] || "N/A"); // Nombre desde índice 8
                d3.select("#id").text(meteorite[9] || "N/A"); // ID desde índice 9
                d3.select("#mass").text(meteorite[12] || "Unknown"); // Masa desde índice 11
                d3.select("#recclass").text(meteorite[11] || "N/A"); // Clase desde índice 12

                // Extraer el año directamente como valor numérico
                let year = meteorite[14] ? new Date(meteorite[14]).getFullYear() : null; // Año desde índice 14
                d3.select("#year").text(year ? `${year}` : "Unknown");

                // Comparación de peso
                let mass = parseFloat(meteorite[12]) || 0; // Convertir la masa a número desde índice 11
                let reference = weightReferences.find(ref => mass <= ref.mass) || weightReferences[weightReferences.length - 1];

                // Actualizar el elemento de comparación
                d3.select("#weightComparison")
                    .html(`This meteorite is as heavy as: <strong>${reference.description}</strong><br>
                           <img src="${reference.image}" alt="Comparison image" style="width:150px; height:auto;">`);
            }
        }

        // Update info on dropdown change
        dropdown.on("change", function() {
            let selectedId = this.value;
            updateInfo(selectedId);
        });

        // Initialize with first meteorite if available
        if (meteorites.length > 0) {
            updateInfo(meteorites[0][9]); // Usar índice correcto para ID de la primera entrada
        }
    } catch (error) {
        console.error("Error fetching meteorite data:", error);
    }
})();