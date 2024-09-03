const svgWidth = 1200; // Adjust to your desired width
const svgHeight = 1000; // Adjust to your desired height
const container = d3.select("#container");

// Create an SVG container
const svg = container
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Define the central div position and rectangle dimensions
const centerX = svgWidth / 2;
const centerY = svgHeight / 2;
const rectWidth = 200; // Adjust the width of the rectangle
const rectHeight = 100; // Adjust the height of the rectangle

// Calculate the hexagon parameters
const hexRadius = 30; // Adjust the hexagon radius as needed
const hexWidth = Math.sqrt(3) * hexRadius;
const hexHeight = 2 * hexRadius;

// Calculate the number of hexagons that can fit around the rectangle
const numCols = Math.floor(rectWidth / (hexWidth * 1.5));
const numRows = Math.floor(rectHeight / hexHeight);

// Calculate the offset to center the hexagons around the rectangle
const xOffset = (rectWidth - (numCols * hexWidth * 1.5)) / 2;
const yOffset = (rectHeight - (numRows * hexHeight)) / 2;

// Create a hexagonal grid
const hexagons = [];
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    const x = centerX - rectWidth / 2 + xOffset + (col * 1.5 * hexWidth);
    const y = centerY - rectHeight / 2 + yOffset + (row * hexHeight);

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
  .attr("d", (d) => d.path);

// Add a rectangle inside the SVG
svg
  .append("rect")
  .attr("x", centerX - rectWidth / 2)
  .attr("y", centerY - rectHeight / 2)
  .attr("width", rectWidth)
  .attr("height", rectHeight)
  .attr("fill", "blue"); // You can set the color you prefer

// Function to generate hexagon path (same as in your original code)
function generateHexagonPath(x, y, radius) {
  const angle = (Math.PI / 180) * 30;
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
