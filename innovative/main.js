// Set up the donut chart parameters
const width = 400;
const height = 400;
const radius = Math.min(width, height) / 2;
const donutWidth = 25;

// Create SVG container
const svg = d3
  .select("#donut-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

// Create a function to draw the donut chart
const drawDonutChart = (data) => {
  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create the arc for the donut chart
  const arc = d3
    .arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  // Create the donut chart
  const pie = d3.pie();

  // Bind the data to the SVG elements
  const arcs = svg
    .selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Append paths for each arc
  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .on("click", handleClick); // Add a click event

  // Function to handle click events
  function handleClick(event, d) {
    // Remove existing lines
    svg.selectAll(".line").remove();
  
    // Calculate the angle of the selected sector in radians
    const angle = (event.startAngle + event.endAngle) / 2;
    // Calculate line coordinates
    const angleInRadians = (angle * Math.PI) / 180;
    const lineData = [
    [0, 0],
    [Math.cos(angleInRadians) * radius, Math.sin(angleInRadians) * radius],
    ];
  
    // Draw the line
    const line = d3.line();
    svg
      .append("path")
      .attr("class", "line")
      .attr("d", line(lineData))
      .attr("stroke", "black");
  }
};

// Sample data
const data = [];

// Call the drawDonutChart function with your data
drawDonutChart();
