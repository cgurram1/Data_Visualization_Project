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
            .on("click",handleCountryClick);
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
