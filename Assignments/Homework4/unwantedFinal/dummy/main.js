document.addEventListener("DOMContentLoaded", function () {
    // Load world map data
    d3.json("countries.geojson").then(function (worldData) {
        // Filter out Antarctica feature
        const filteredData = worldData.features.filter(function (feature) {
            return feature.properties.ADMIN !== "Antarctica";
        });
        drawMap({ type: "FeatureCollection", features: filteredData });
    });

    // Function to draw the map
    function drawMap(worldData) {
        const svg = d3.select("#world-map");
        const projection = d3.geoMercator().fitSize([500, 500], worldData);
        const path = d3.geoPath().projection(projection);

        // Draw the map
        svg.selectAll("path")
            .data(worldData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country")
            .on("mouseover", handleCountryHover)
            .on("mouseout", handleCountryExit)
            .on("click", handleCountryClick);

        // Create a hexagonal grid around the map-container
        const hexRadius = 20; // Adjust the radius as needed
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = 2 * hexRadius;

        const rows = 10; // Adjust the number of rows
        const cols = 10; // Adjust the number of columns

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * hexWidth * 0.75;
                const y = row * hexHeight + (col % 2) * (hexHeight / 2);

                svg.append("polygon")
                    .attr("points", calculateHexPoints(x, y, hexRadius))
                    .attr("class", "grid-hexagon");
            }
        }
    }

    // Function to calculate the points of a hexagon given a center (x, y) and a radius
    function calculateHexPoints(x, y, radius) {
        const angle = Math.PI / 3;
        const points = [];

        for (let i = 0; i < 6; i++) {
            const pointX = x + radius * Math.cos(i * angle);
            const pointY = y + radius * Math.sin(i * angle);
            points.push([pointX, pointY]);
        }

        return points.join(" ");
    }

    // Event handler for mouseover
    function handleCountryHover(event, d) {
        d3.select(event.target).classed("hovered", true);
    }

    // Event handler for mouseout
    function handleCountryExit(event, d) {
        d3.select(event.target).classed("hovered", false);
    }

    function handleCountryClick(event, d) {
        // Access the country name from the data (d) and display it
        const countryName = d.properties.ADMIN; // Assuming "name" is the property containing the country name
        alert("Clicked on: " + countryName);
    }
});
