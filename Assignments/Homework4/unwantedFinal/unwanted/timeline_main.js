// Data for the timeline
const timelineData = [
    { year: 2011, event: "Event 1" },
    { year: 2012, event: "Event 2" },
    { year: 2013, event: "Event 3" },
    { year: 2014, event: "Event 4" },
    { year: 2015, event: "Event 5" },
    { year: 2016, event: "Event 6" },
  ];
  
  // Set up the dimensions for the timeline
  const width = 800;
  const height = 80;
  const radius = 0; // Curvature radius for the pipe
  
  // Create the SVG container
  const svg = d3.select("#timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Create a path for the curved rectangle
  const pipePath = `M0 ${height / 2} Q${width / 2} ${height} ${width} ${height / 2}`;
  
  svg.append("path")
    .attr("d", pipePath)
    .attr("stroke", "#3498db")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  
  // Create circles for each event on the timeline
  const events = svg.selectAll(".event")
    .data(timelineData)
    .enter()
    .append("circle")
    .attr("class", "event")
    .attr("cx", d => (d.year - 2011) * (width / (2016 - 2011 + 1)))
    .attr("cy", height / 2)
    .attr("r", radius)
    .on("mouseover", function(d) {
      // Add tooltip or other interactions here
      console.log(`Year: ${d.year}, Event: ${d.event}`);
    });
  
  // Add event text labels
  svg.selectAll(".event-text")
    .data(timelineData)
    .enter()
    .append("text")
    .attr("class", "event-text")
    .attr("x", d => (d.year - 2011) * (width / (2016 - 2011 + 1)))
    .attr("y", height / 2 - radius - 5) // Adjust the vertical position
    .text(d => d.event);
  