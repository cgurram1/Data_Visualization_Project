const numLines = 308;
const radius = 380;
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

// Create a rectangle with its center at the center of the circle
const rectWidth = 300;
const rectHeight = 300;



const angle = 360 / numLines;

for (let i = 0; i < numLines; i++) {
    const theta = (angle * i) * (Math.PI / 180);
    const x1 = center.x + radius * Math.cos(theta);
    const y1 = center.y + radius * Math.sin(theta);
    const x2 = center.x;
    const y2 = center.y;

    svg.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "black");
}
svg.append("circle")
    .attr("cx", center.x)  // Adjust the width as needed
    .attr("cy", center.y)  // Adjust the height as needed
    .attr("r",200)
    .attr("fill", "white")  // Set the rectangle color
// const svg2 = d3.select("#world-map")
//     .append("svg")
//     .attr("width", 330)
//     .attr("height", 210);
d3.json("countries.geojson").then(function (worldData) {
    const filteredData = worldData.features.filter(function (feature) {
        return feature.properties.ADMIN !== "Antarctica";
    });
    drawMap({ type: "FeatureCollection", features: filteredData });
    });


// function drawMap(worldData) {
//     const svg2 = d3.select("#world-map");
//     const projection = d3.geoMercator().fitSize([350, 230], worldData);
//     const path = d3.geoPath().projection(projection);

//     svg2.selectAll("path")
//         .data(worldData.features)
//         .enter()
//         .append("path")
//         .attr("d", path)
//         .attr("class", "country")
//         .attr("stroke", 'white')
//         .attr("stroke-width", "0.2")
//         .on("mouseover", handleCountryHover)
//         .on("mouseout", handleCountryExit)
//         .on("click",handleCountryClick);
//         const zoom = d3.zoom()
//         .scaleExtent([0.5, 4]) // Define your minimum and maximum zoom levels
//         .on("zoom", zoomed);
    
//     svg2.call(zoom);
    
//     function zoomed(event) {
//         const { transform } = event;
//         svg2.attr("transform", transform);
//     }
// }
function drawMap(worldData) {
    const svg = d3.select("#world-map");
    const width = 330;
    const height = 210;

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.call(zoom);

    const g = svg.append("g");

    const projection = d3.geoMercator().fitSize([width, height], worldData);
    const path = d3.geoPath().projection(projection);

    g.selectAll("path")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "country")
        .attr("stroke", 'white')
        .attr("stroke-width", "0.2")
        .on("mouseover", handleCountryHover)
        .on("mouseout", handleCountryExit)
        .on("click",handleCountryClick);

    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
    }
}


function handleCountryHover(event, d) {
    d3.select(event.target).classed("hovered", true);
    console.log(d.properties.ADMIN)
}

function handleCountryExit(event, d) {
    d3.select(event.target).classed("hovered", false);
}

function handleCountryClick(event, d) {
    const countryName = d.properties.ADMIN;
    alert("Clicked on: " + countryName);

}
