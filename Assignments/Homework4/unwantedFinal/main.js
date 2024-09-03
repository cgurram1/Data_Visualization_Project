const svgWidth = 1200; // Adjust to your desired width
const svgHeight = 1000; // Adjust to your desired height
const container = d3.select("#container");

// Create an SVG container
const svg = container
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Define the central div position
const centerX = 100;
const centerY = 100;

// Hexagon parameters
const hexRadius = 18; // Adjust the hexagon radius as needed
const hexWidth = Math.sqrt(3) * hexRadius;
const hexHeight = 2 * hexRadius;

// Create a hexagonal grid
const numRows = 15; // Adjust to control the number of hexagons
const numCols = 20; // Adjust to control the number of hexagons

const hexagons = [];
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const x = centerX + (col * 1.5 * hexWidth);
    const y = centerY + (row * hexHeight);

    // Generate a unique hexagon path for each hexagon
    const hexagonPath = generateHexagonPath(x, y, hexRadius);

    hexagons.push({ x, y, path: hexagonPath });
  }
}

// Create hexagon elements
const hexagonElements = svg
  .selectAll(".hexagon")
  .data(hexagons)
  .enter()
  .append("path")
  .attr("class", "hexagon")
  .attr("d", d => d.path);

// Add a rectangle inside the SVG
const rectWidth = 100; // Adjust the width of the rectangle
const rectHeight = 50; // Adjust the height of the rectangle

svg
  .append("rect")
  .attr("x", svgWidth / 2)
  .attr("y", svgHeight / 2)
  .attr("width", rectWidth)
  .attr("height", rectHeight)
  .attr("fill", "blue"); // You can set the color you prefer

function generateHexagonPath(x, y, radius) {
  const angle = (Math.PI / 180) * 30; // 30 degrees in radians
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;

  const points = [];
  for (let i = 0; i < 6; i++) {
    const px = x + Math.cos((Math.PI / 180) * (60 * i)) * radius;
    const py = y + Math.sin((Math.PI / 180) * (60 * i)) * radius;
    points.push([px, py]);
  }

  return `M${points.join("L")}Z`;
}
