document.addEventListener("DOMContentLoaded", function () {
  // Parameters
  

  d3.json('dataJSON.json')
        .then(function(data) {
        
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
  
  svg.append('defs')
    .append('clipPath')
    .attr('id', 'hexagon-clip')
    .append('path')
    .attr('d', hexLayout.hexagon(hexRadius));
  
  shadow_filter_green = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow-green')
    .attr('x', '-50%') // Adjust this value to control the shadow size
    .attr('y', '-50%') // Adjust this value to control the shadow size
    .attr('width', '200%') // Adjust this value to control the shadow size
    .attr('height', '200%') // Adjust this value to control the shadow size
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'green');

  shadow_filter_red = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow-red')
    .attr('x', '-50%') // Adjust this value to control the shadow size
    .attr('y', '-50%') // Adjust this value to control the shadow size
    .attr('width', '200%') // Adjust this value to control the shadow size
    .attr('height', '200%') // Adjust this value to control the shadow size
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'red');

  shadow_filter_blue = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow-blue')
    .attr('x', '-50%') // Adjust this value to control the shadow size
    .attr('y', '-50%') // Adjust this value to control the shadow size
    .attr('width', '200%') // Adjust this value to control the shadow size
    .attr('height', '200%') // Adjust this value to control the shadow size
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'blue')
    .attr('result', 'coloredShadow');
  
  shadow_filter = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow')
    .attr('x', '-50%') // Adjust this value to control the shadow size
    .attr('y', '-50%') // Adjust this value to control the shadow size
    .attr('width', '200%') // Adjust this value to control the shadow size
    .attr('height', '200%') // Adjust this value to control the shadow size
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5);
  
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
    .append("path")
    .attr("class", i => {
      // console.log(i[0][3].name)
      return `hexagon ${i[0][3].name} ${i[0][3].lived_in} `})
    .attr('d', d => hexLayout.hexagon(hexRadius))
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('filter', (d,i)=>{
      return 'url(#hexagon-shadow)'
    })
    .attr('fill', (d,i) => {
      if(d[0][3].diet == "carnivorous"){
        return "#FB5555";
      }
      else if(d[0][3].diet == "herbivorous"){
        return "#8FF890";
      }
      else{
        return "#8DC8F8";
      }
    })
    .on("mouseover", function (d, i) {
      if (d3.select(this).attr("fill") !== "black") {
        var [x, y] = d3.pointer(d, window);
        console.log(x)
        console.log(y)
        console.log("")
        // console.log(`${i[0][3].diet}`)
        // console.log(`#country_${i[0][3].lived_in}`)
        var dynamicText = i[0][3].name;
        dynamicText = dynamicText.charAt(0).toUpperCase() + dynamicText.slice(1);
        d3.select('.D_Name')
          .text(dynamicText);
        d3.select(".D_Lived_In").text("Lived In: " + i[0][3].lived_in)
        d3.select(".D_Length").text("Length: " + i[0][3].length)
        d3.select(".D_Diet").text("Diet: " + i[0][3].diet)
        d3.select(`.country_${i[0][3].lived_in}`).classed("hovered", true);
        d3.select(this).attr("fill", (d,i)=>{
          if(d[0][3].diet == "carnivorous"){
            return "#E71641";
          }
          else if(d[0][3].diet == "herbivorous"){
            return "#3D930E";
          }
          else{
            return "#0F5D7A";
          }
        })
      }
    })
    .on("mouseout", function (d, i) {
      if (d3.select(this).attr("fill") !== "black") {
      d3.select(`.country_${i[0][3].lived_in}`).classed("hovered", false);
      d3.select(this).attr("fill", (d,i)=>{
        if(d[0][3].diet == "carnivorous"){
          return "#FB5555";
        }
        else if(d[0][3].diet == "herbivorous"){
          return "#8FF890";
        }
        else{
          return "#8DC8F8";
        }
      })
      d3.select(".tooltip")
        .style("visibility", "hidden");
      }
    })
    .on("mousemove", function(d,i){
      if (d3.select(this).attr("fill") !== "black") {
      var [x, y] = d3.pointer(d, window);
      x = x - 340
      if(y+10 > 420){
        y = 420
      }
      d3.select(".tooltip")
        .style("left", x+10 + "px")
        .style("top", y+20 + "px")
        .style("visibility", "visible");
    }
    });

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
        .attr("class", (d)=>{
          return "country " + "country_" + d.properties.ADMIN})
        .attr("stroke", '#100e2a')
        .attr("stroke-width", "1")
        .on("mouseover", handleCountryHover)
        .on("mouseout", handleCountryExit)
        .on("click",handleCountryClick);
}

function handleCountryHover(event, d) {
    d3.select(event.target).classed("hovered", true);
    // console.log(d.properties.ADMIN)
    // console.log(d3.select("USA").classed)
    d3.selectAll(`.${d.properties.ADMIN}`).attr("fill", (d,i)=>{
      if(d[0][3].diet == "carnivorous"){
        return "#E71641";
      }
      else if(d[0][3].diet == "herbivorous"){
        return "#3D930E";
      }
      else{
        return "#0F5D7A";
      }
    })
    d3.selectAll('.hexagon:not(.' + d.properties.ADMIN + ')')
    .attr("fill","black");
}
let countryClicked = false;
function handleCountryExit(event, d) {
  if(countryClicked == false){
    d3.select(event.target).classed("hovered", false);
    console.log(d.properties.ADMIN)
    d3.selectAll(".hexagon").attr("fill", (d,i)=>{
      if(d[0][3].diet == "carnivorous"){
        return "#FB5555";
      }
      else if(d[0][3].diet == "herbivorous"){
        return "#8FF890";
      }
      else{
        return "#8DC8F8";
      }
    })
  }
}

function handleCountryClick(event, d) {
    const countryName = d.properties.ADMIN;
    countryClicked = !countryClicked;
    alert("Clicked on: " + countryName);

}

});
});
