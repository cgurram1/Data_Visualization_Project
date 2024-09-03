document.addEventListener("DOMContentLoaded", function () {
  

  d3.json('dataJSON.json')
        .then(function(data) {
        
  const width = 920;
  const height = 740;
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
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%')
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'green');

  shadow_filter_red = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow-red')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%')
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'red');

  shadow_filter_blue = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow-blue')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%')
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)
    .attr('flood-color', 'blue')
    .attr('result', 'coloredShadow');
  
  shadow_filter = svg.append('defs')
    .append('filter')
    .attr('id', 'hexagon-shadow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%')
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5);
  
  let previous_time_x = 450
  var colors = ["#ffcf4a", "#ff9e00", "#fe4316", "#cb1c69", "#6940b5", "lightblue"];
  var time_periods = ["Late Triassic","Early Jurassic","Mid Jurassic","Late Jurassic","Early Cretaceous","Late Cretaceous"]
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
        // console.log(x)
        // console.log(y)
        // console.log("")
        // console.log(`${i[0][3].diet}`)
        // console.log(`#country_${i[0][3].lived_in}`)
        var dynamicText = i[0][3].name;
        dynamicText = dynamicText.charAt(0).toUpperCase() + dynamicText.slice(1);
        d3.select('.D_Name')
          .text(dynamicText);
        d3.select(".D_Lived_In").text("Lived In: " + i[0][3].lived_in)
        d3.select(".D_Length").text("Length: " + i[0][3].length)
        d3.select(".D_Diet").text("Diet: " + i[0][3].diet)
        // if(countryClicked == false){
        //   d3.select(`.country_${i[0][3].lived_in}`).classed("hovered", true);
        // }
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
        var new_x = (time_periods.indexOf(getFirstTwoWords(i[0][3].period)) + 1) * 75
        // console.log(new_x)
        // if (new_x > previous_time_x) {
          d3.select(".animated_position_right")
            .style("left", new_x + "px")
            .style("visibility", "visible");
          d3.select(".animated_position_left")
            .style("visibility","hidden")
        // }
        // else{
        //   d3.select(".animated_position_left")
        //     .style("left", new_x + "px")
        //     .style("visibility", "visible");
        //   d3.select(".animated_position_right")
        //     .style("visibility","hidden")
        // }
        previous_time_x = new_x;
      }
    })
    .on("mouseout", function (d, i) {
      if (d3.select(this).attr("fill") !== "black") {
      // d3.select(`.country_${i[0][3].lived_in}`).classed("hovered", false);
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
      if(x < 500){
        x = x + 360
      }
      console.log(x)
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
    const projection = d3.geoMercator().fitSize([500, 400], worldData);
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
  if(countryClicked == false){
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
    .attr("fill","black")
    // .style("cursor","not-allowed");
  }
}
let countryClicked = false;


function handleCountryExit(event, d) {
  if(countryClicked == false){
    d3.select(event.target).classed("hovered", false);
    // console.log(d.properties.ADMIN)
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

}
function getFirstTwoWords(inputString) {
  const words = inputString.split(' ');
  const firstTwoWords = words.slice(0, 2);

  return firstTwoWords.join(' ');
}

var svgContainer = d3.select('.timeline-container').append('svg')
  .attr('width', 460)
  .attr('height', 250)


svgContainer.selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
      .attr('x', function(d, i) { return 5 + i * 75})
      .attr('y', 70)
      .attr('width', 75)
      .attr('height', 10)
      .attr('fill', (d,i)=>{return d});
svgContainer.append('circle')
  .attr("cx",5)
  .attr("cy",75)
  .attr("r",5)
  .attr("fill",`${colors[0]}`)
  .attr("start","180")
  .attr("end","360")
svgContainer.append('circle')
  .attr("cx",455)
  .attr("cy",75)
  .attr("r",5)
  .attr("fill",`${colors[5]}`)
  .attr("start","180")
  .attr("end","360")

svgContainer.append('polygon')
  .attr("points","30,80 50,80 40,85")
  .attr("fill",`${colors[0]}`)
svgContainer.append('polygon')
  .attr("points","105,80 125,80 115,85")
  .attr("fill",`${colors[1]}`)
svgContainer.append('polygon')
  .attr("points","180,80 200,80 190,85")
  .attr("fill",`${colors[2]}`)
svgContainer.append('polygon')
  .attr("points","255,80 275,80 265,85")
  .attr("fill",`${colors[3]}`)
svgContainer.append('polygon')
  .attr("points","330,80 350,80 340,85")
  .attr("fill",`${colors[4]}`)
svgContainer.append('polygon')
  .attr("points","405,80 425,80 415,85")
  .attr("fill",`${colors[5]}`)
svgContainer.append('line')
  .attr("x1",40)
  .attr("y1",84)
  .attr("x2",40)
  .attr("y2",105)
  .attr("stroke",`${colors[0]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 3)
  .attr('y', 130)
  .attr('font-size', 15)
  .attr('fill', `${colors[0]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Late Triassic");
svgContainer.append('line')
  .attr("x1",115)
  .attr("y1",84)
  .attr("x2",115)
  .attr("y2",140)
  .attr("stroke",`${colors[1]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 65)
  .attr('y', 170)
  .attr('font-size', 15)
  .attr('fill', `${colors[1]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Early Jurassic");
svgContainer.append('line')
  .attr("x1",190)
  .attr("y1",84)
  .attr("x2",190)
  .attr("y2",105)
  .attr("stroke",`${colors[2]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 153)
  .attr('y', 130)
  .attr('font-size', 15)
  .attr('fill', `${colors[2]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Mid Jurassic");
svgContainer.append('line')
  .attr("x1",265)
  .attr("y1",84)
  .attr("x2",265)
  .attr("y2",140)
  .attr("stroke",`${colors[3]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 220)
  .attr('y', 170)
  .attr('font-size', 15)
  .attr('fill', `${colors[3]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Late Jurassic");
svgContainer.append('line')
  .attr("x1",340)
  .attr("y1",84)
  .attr("x2",340)
  .attr("y2",105)
  .attr("stroke",`${colors[4]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 280)
  .attr('y', 130)
  .attr('font-size', 15)
  .attr('fill', `${colors[4]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Early Cretaceous");
svgContainer.append('line')
  .attr("x1",415)
  .attr("y1",84)
  .attr("x2",415)
  .attr("y2",140)
  .attr("stroke",`${colors[5]}`)
  .attr("stroke-width","2")
svgContainer.append('text')
  .attr('x', 345)
  .attr('y', 170)
  .attr('font-size', 15)
  .attr('fill', `${colors[5]}`)
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size',"x-large")
  .text("Late Cretaceous");
svgContainer.append('text')
  .attr('x', 100)
  .attr('y', 240)
  .attr('font-size', 15)
  .attr('fill', 'white')
  .style('font-family', "'Butterfly Kids', cursive")
  .style('font-size', 'xx-large')
  .style('font-weight', 'bold')
  .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.5)')
  .text("Dinosaur Existence Timeline");
});
});
