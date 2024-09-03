const totalHexagons = 309;
const width = 1000;
const height = 1000;

const hexRadius = 15;
const hexWidth = Math.sqrt(3) * hexRadius;
const hexHeight = 2 * hexRadius;

// Calculate the number of hexagons in a row to fit the screen
const hexagonsPerRow = Math.floor(width / hexWidth);

// Calculate the total number of rows needed
const numRows = Math.ceil(totalHexagons / hexagonsPerRow);

// Create a hexbin layout
const hexbin = d3.hexbin().radius(hexRadius);

// Create an SVG container
const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

// Generate hexagon centers
const hexagonCenters = [];
for (let row = 0; row < numRows; row++) {
  const yOffset = row * 1.5 * hexRadius;
  const xOffset = (row % 2 === 1) ? 1.5 * hexRadius : 0;
  for (let col = 0; col < hexagonsPerRow && hexagonCenters.length < totalHexagons; col++) {
    const x = xOffset + col * 3 * hexRadius;
    const y = yOffset;
    hexagonCenters.push([x, y]);
  }
}

// Draw hexagons
svg.append('g')
  .selectAll('.hexagon')
  .data(hexbin(hexagonCenters))
  .enter().append('path')
  .attr('class', 'hexagon')
  .attr('d', d => hexbin.hexagon())
  .attr('transform', d => `translate(${d.x},${d.y})`);

