document.addEventListener("DOMContentLoaded", function () {
  // Parameters

  d3.json('dataJSON.json')
      .then(function (data) {

          const width = 920;
          const height = 750;
          const hexRadius = 27;
          const hexMargin = 0;

          const hexWidth = Math.sqrt(3) * hexRadius + hexMargin;
          const hexHeight = 2 * hexRadius + hexMargin * 2;
          const yOffset = hexHeight * 0.75;

          const numHexagonsX = Math.ceil(width / hexWidth) - 1;
          const numHexagonsY = Math.ceil(height / hexHeight);

          const svg = d3.select(".hexgrid-container")
              .append("svg")
              .attr("class", "hex_svg")
              .attr("width", width)
              .attr("height", height);

          const hexLayout = d3.hexbin()
              .x(d => d[0])
              .y(d => d[1])
              .radius(hexRadius);

          const hexagons = svg.append("g")
              .attr("transform", "translate(0, 20)")
              .selectAll(".hexagon")
              .data(hexLayout(data.map((d, i) => {
                  const row = Math.floor(i / numHexagonsX);
                  const x = (i % numHexagonsX) * (hexWidth + 1) + (row % 2 === 1 ? hexWidth / 2 : 0);
                  const y = row * yOffset + 28;
                  return [x, y, i, d];
              })))
              .enter()
              .append("g") // Wrap each hexagon in a group
              .on("mouseover", function (d, i) {
                  // console.log(d)
                  console.log(i)
              })
              .on("click", handleHexagonClick); // Apply click event to the entire group

          hexagons.append("path")
              .attr("class", i => {
                  // console.log(i[0][3].name)
                  return `hexagon ${i[0][3].name} ${i[0][3].lived_in} `
              })
              .attr('d', d => hexLayout.hexagon(hexRadius))
              .attr('transform', d => `translate(${d.x},${d.y})`)
              .attr("stroke", "black") // Set the stroke color
              .attr("stroke-width", 3) // Set the stroke width
              .attr("fill", "none") // Set fill to none
              .style("filter", "url(#drop-shadow)"); // Apply the shadow filter

          // Add a filter for the shadow effect
          var filter = svg.append('defs')
              .append('filter')
              .attr('id', 'drop-shadow')
              .attr('height', '130%');

          filter.append('feGaussianBlur')
              .attr('in', 'SourceAlpha')
              .attr('stdDeviation', 5)
              .attr('result', 'blur');

          filter.append('feOffset')
              .attr('in', 'blur')
              .attr('dx', 5)
              .attr('dy', 5)
              .attr('result', 'offsetBlur');

          var feMerge = filter.append('feMerge');

          feMerge.append('feMergeNode')
              .attr('in', 'offsetBlur');

          feMerge.append('feMergeNode')
              .attr('in', 'SourceGraphic');

          // Apply the shadow filter to the hexagon
          hexagons.style("filter", "url(#drop-shadow)");

          d3.json("countries.geojson").then(function (worldData) {
              const filteredData = worldData.features.filter(function (feature) {
                  return feature.properties.ADMIN !== "Antarctica";
              });
              drawMap({ type: "FeatureCollection", features: filteredData });
          });

          function drawMap(worldData) {
              const svg = d3.select("#world-map");
              const projection = d3.geoMercator().fitSize([500, 500], worldData);
              const path = d3.geoPath().projection(projection);

              svg.selectAll("path")
                  .data(worldData.features)
                  .enter()
                  .append("path")
                  .attr("d", path)
                  .attr("class", "country")
                  .attr("stroke", '#100e2a')
                  .attr("stroke-width", "1")
                  .on("mouseover", handleCountryHover)
                  .on("mouseout", handleCountryExit)
                  .on("click", handleCountryClick);
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

          function handleHexagonClick(event, d) {
              const hexagonData = d[0][3];
              // Handle the click event for the hexagon
              console.log("Clicked on hexagon:", hexagonData);
          }
      });
});
