// Sample data (replace this with your actual data)

var financialHealthDaily = [];
var financialHealthWeekly = [];
var financialHealthMonthly = [];
var financialHealth = [];
var organizedData = {};

// Set up the dimensions and margins for the scatter plot
const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

let selectedTimeframe = "daily";
let currentTimestampIndex = 0;
let timestamps = []; // Assuming you have an array of timestamps
let isPlaying = false;
let selectedMonth = null;
let selectedCategory = "TotalAmountSpent";
let scatterContainer;
let zoomedSectionContainer;
let svg;
let animationTimeout;

window.onload = function () {
  scatterContainer = d3.select("#scatter-plot");
  zoomedSectionContainer = d3.select("#zoomed-section");
  const additionalScatter = d3.select("#detail-plot");
  const playBtn = d3.select("#playBtn");
  let categorySelection = d3.select("#category-selector");

  // Create the SVG container for the scatter plot
  svg = scatterContainer
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data_task2_extra/FinancialHealthData.csv").then((data) => {
    // per participant one entry for everyday
    financialHealthDaily = data;
    financialHealthDaily.forEach((d) => {
      d.AmountSpentOnFood = +d.AmountSpentOnFood || 0;
      d.AmountSpentOnEducation = +d.AmountSpentOnEducation || 0;
      d.AmountSpentOnRecreation = +d.AmountSpentOnRecreation || 0;
      d.AmountSpentOnShelter = +d.AmountSpentOnShelter || 0;
      d.Income = +d.Income || 0;
      d.TotalAmountSpent =
        d.AmountSpentOnFood +
          d.AmountSpentOnEducation +
          d.AmountSpentOnRecreation +
          d.AmountSpentOnShelter || 0;
    });
    financialHealth = financialHealthDaily;
  });

  d3.csv("data_task2_extra/weekly.csv").then((data) => {
    // per participant one entry for a week - total(sum)
    financialHealthWeekly = data;
    financialHealthWeekly.forEach((d) => {
      d.AmountSpentOnFood = +d.AmountSpentOnFood;
      d.AmountSpentOnEducation = +d.AmountSpentOnEducation;
      d.AmountSpentOnRecreation = +d.AmountSpentOnRecreation;
      d.AmountSpentOnShelter = +d.AmountSpentOnShelter;
      d.AmountSpentOnWage = +d.AmountSpentOnWage;
      d.TotalHours = +d.TotalHours;
      d.Income = +d.Income;
      d.TotalAmountSpent =
        d.AmountSpentOnFood +
        d.AmountSpentOnEducation +
        d.AmountSpentOnRecreation +
        d.AmountSpentOnShelter;
    });
  });

  d3.csv("data_task2_extra/monthly.csv").then((data) => {
    // per participant one entry for an entire month - total(sum)
    financialHealthMonthly = data;
    financialHealthMonthly.forEach((d) => {
      d.AmountSpentOnFood = +d.AmountSpentOnFood;
      d.AmountSpentOnEducation = +d.AmountSpentOnEducation;
      d.AmountSpentOnRecreation = +d.AmountSpentOnRecreation;
      d.AmountSpentOnShelter = +d.AmountSpentOnShelter;
      d.AmountSpentOnWage = +d.AmountSpentOnWage;
      d.TotalHours = +d.TotalHours;
      d.Income = +d.Income;
      d.TotalAmountSpent =
        d.AmountSpentOnFood +
        d.AmountSpentOnEducation +
        d.AmountSpentOnRecreation +
        d.AmountSpentOnShelter;
    });
  });

  //createScatterPlot(organizedData,timestamps[0]);

  categorySelection.selectAll('input[type="radio"]')?.on("change", function () {
    const selectedRadioButton = d3.select(this);
    selectedCategory = getCategoryLabel(selectedRadioButton.property("value"));

    console.log("one");
    createScatterPlot(organizedData, timestamps[0]);
    d3.select("#zoomed-section").selectAll("*").remove();
    d3.select("#barChart").selectAll("*").remove();
    d3.select("#donutChart").selectAll("*").remove();
    if (selectedTimeframe == "monthly") {
      createMonthScatterPlot(organizedData);
    }
  });

  document
    .getElementById("timeframe-dropdown")
    .addEventListener("change", function () {
      selectedTimeframe = this.value;
      updateFinancialData(selectedTimeframe);
      console.log("two");
      if (selectedTimeframe == "monthly") {
        createMonthScatterPlot(organizedData);
      } else {
        d3.select("#detail-plot").selectAll("*").remove();
        d3.select("#zoomed-section").selectAll("*").remove();
        d3.select("#barChart").selectAll("*").remove();
        d3.select("#donutChart").selectAll("*").remove();
      }
      // createScatterPlot(organizedData, timestamps[0]);
    });

  // Call playAnimation when the play button is clicked
  d3.select("#playBtn").on("click", handlePlayButtonClick);
};

function createScatterPlot(data, timestamp) {
  const entriesForTimestamp = data[timestamp];

  svg.select(".x-axis").style("opacity", 0).remove();
  svg.select(".y-axis").style("opacity", 0).remove();

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(entriesForTimestamp, (d) => d[selectedCategory])])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(entriesForTimestamp, (d) => d.Income)])
    .range([height, 0]);

  // Use d3.join for enter, update, and exit
  const circles = svg
    .selectAll("circle")
    .data(entriesForTimestamp, (d) => d.ParticipantId);

  circles.join(
    (enter) =>
      enter
        .append("circle")
        .attr("cx", (d) => x(d[selectedCategory]))
        .attr("cy", (d) => y(d.Income))
        .attr("r", 5)
        .style("fill", "#69b3a2")
        .call((enter) => enter.transition().duration(1000).style("opacity", 1)),
    (update) =>
      update
        .transition()
        .duration(1000)
        .attr("cx", (d) => x(d[selectedCategory]))
        .attr("cy", (d) => y(d.Income)),
    (exit) =>
      exit.call((exit) =>
        exit.transition().duration(1000).style("opacity", 0).remove()
      )
  );
  console.log(">> 2");
  // Add X and Y axes
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
  console.log(">> 3");
}

// Function to handle hover over scatter plot
// Function to handle hover over scatter plot in zoomed section
function handleScatterHover(event, data) {
  const tooltip = d3.select("#scatter-tooltip");
  console.log("tooltip : ", tooltip);
  tooltip.transition()
            .duration(200)
            .style('opacity', 1)
            .style('display', 'block');
  console.log("data : ", data);
  // You can customize the tooltip content based on your data
  const tooltipContent = `Income: ${data.Income}, ${selectedCategory}: ${data[selectedCategory]}`;
  console.log("event", event);
  tooltip.html(tooltipContent);
  tooltip.style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
}

// Function to handle mouseout over scatter plot in zoomed section
function handleScatterMouseout() {
  const tooltip = d3.select("#scatter-tooltip");
  tooltip.transition()
            .duration(500)
            .style('opacity', 0)
            .style('display', 'none');
}

// Function to handle click on scatter plot
function handleSectionClick(event, data, section) {
  // Your D3 code to create additional scatter plot
  console.log("three", data);
  console.log("three 2", section);
  createZoomedScatterPlot(section);
  // if (d.Month != undefined) {
  //   console.log("three", d.Month);
  //   // createScatterPlot(d);
  // }
}

function handleScatterClick(event, d) {
  console.log("four", d);
  createBarChart(d);
}

function createBarChart(data) {

  d3.select("#barChart").select('svg').remove();
  d3.select("#donutChart").select('svg').remove();

  // Bar chart: Total Amount Spent vs Income
  var barChart = d3
    .select("#barChart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300);

  var barData = [
    { label: "Total Amount Spent", value: data.TotalAmountSpent },
    { label: "Income", value: data.Income },
  ];

  var barX = d3
    .scaleBand()
    .domain(barData.map((d) => d.label))
    .range([0, 400])
    .padding(0.1);

  var barY = d3
    .scaleLinear()
    .domain([0, d3.max(barData, (d) => d.value)])
    .range([200, 0]);

  barChart
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.axisLeft(barY));

  barChart
    .append("g")
    .attr("transform", "translate(" + margin.left + ",210)")
    .call(d3.axisBottom(barX));

  barChart
    .selectAll("rect")
    .data(barData)
    .enter()
    .append("rect")
    .attr("x", (d) => barX(d.label)+margin.left)
    .attr("y", (d) => barY(d.value))
    .attr("width", barX.bandwidth())
    .attr("height", (d) => 200 - barY(d.value))
    .attr("fill", "steelblue");

  // Donut chart: Expenses
  var donutChart = d3
    .select("#donutChart")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200)
    .append("g")
    .attr("transform", "translate(100,100)");
  console.log(donutChart, barChart);
  var donutData = [
    { label: "Education", value: data.AmountSpentOnEducation },
    { label: "Food", value: data.AmountSpentOnFood },
    { label: "Recreation", value: data.AmountSpentOnRecreation },
    { label: "Shelter", value: data.AmountSpentOnShelter },
  ];

  var donutColor = d3
    .scaleOrdinal()
    .domain(donutData.map((d) => d.label))
    .range(["#ff9999", "#66b3ff", "#99ff99", "#ffcc99"]);

  var donut = d3.pie().value((d) => d.value);

  var arc = d3.arc().innerRadius(50).outerRadius(100);

  donutChart
    .selectAll("path")
    .data(donut(donutData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => donutColor(d.data.label))
    .attr("stroke", "white")
    .on("mouseover", function (event, d) {
      // Tooltip on hover
      const tooltip = d3.select("#scatter-tooltip");
      console.log("tooltip : ", tooltip);
      tooltip.transition()
                .duration(200)
                .style('opacity', 1)
                .style('display', 'block');
      console.log("data : ", d);
      // You can customize the tooltip content based on your data
      console.log("event", event);
      tooltip.html(d.data.label + ": " + d.data.value.toFixed(2));
      tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
    })
    .on("mouseout", function () {
      // Remove tooltip on mouseout
      const tooltip = d3.select("#scatter-tooltip");
      tooltip.transition()
            .duration(500)
            .style('opacity', 0)
            .style('display', 'none');
    });
}

function handlePlayButtonClick() {
  if (isPlaying) {
    d3.select("#playBtn").html("Play");
    stopAnimation();
  } else {
    d3.select("#playBtn").html("Pause");
    playAnimation();
  }
}

function playAnimation() {
  isPlaying = true;
  console.log(currentTimestampIndex, timestamps.length);
  if (currentTimestampIndex < timestamps.length && isPlaying) {
    const currentTimestamp = timestamps[currentTimestampIndex];
    if (selectedTimeframe == "weekly") {
      let currentDate = new Date(currentTimestamp);
      let date = currentDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      currentDate.setDate(currentDate.getDate() + 6);
      date +=
        " - " +
        currentDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      d3.select("#displayDate").html(date);
    } else d3.select("#displayDate").html(currentTimestamp);
    console.log("four");
    createScatterPlot(organizedData, currentTimestamp);
    currentTimestampIndex++;

    // You may want to adjust the delay based on your requirements
    animationTimeout = setTimeout(playAnimation, 1000);
  } else {
    stopAnimation();
    currentTimestampIndex = 0;
    timestamps = [];
  }
}

function stopAnimation() {
  isPlaying = false;
  clearTimeout(animationTimeout);
}

function updateFinancialData(selectedTimeframe) {
  organizedData = {};

  if (selectedTimeframe === "daily") {
    financialHealth = financialHealthDaily;
    // Object to store organized data
    // Iterate through the original data
    financialHealth.forEach((entry) => {
      const date = entry.Date;

      // If the date is not in the organizedData object, create an empty array
      if (!organizedData[date]) {
        organizedData[date] = [];
      }

      // Push the current entry to the array corresponding to the date
      organizedData[date].push(entry);
    });

    // Print the result

    // Initial creation of the scatter plot for the first timestamp
    console.log("five");
  } else if (selectedTimeframe === "weekly") {
    financialHealth = financialHealthWeekly;
    console.log("week financialHealth : ", financialHealth);
    // Group data by week
    organizedData = financialHealth.reduce((acc, entry) => {
      const week = entry.Week;

      // If the week is not in the accumulator, create an array for it
      if (!acc[week]) {
        acc[week] = [];
      }

      // Push the current entry to the array for the week
      acc[week].push(entry);

      return acc;
    }, {});

    console.log(organizedData);
  } else if (selectedTimeframe === "monthly") {
    financialHealth = financialHealthMonthly;
    console.log("month financialHealth : ", financialHealth);
    // Group data by week
    organizedData = financialHealth.reduce((acc, entry) => {
      const month = entry.Month;

      // If the month is not in the accumulator, create an array for it
      if (!acc[month]) {
        acc[month] = [];
      }

      // Push the current entry to the array for the month
      acc[month].push(entry);

      return acc;
    }, {});

    createMonthScatterPlot(organizedData);
  }
  currentTimestampIndex = 0;
  timestamps = Object.keys(organizedData);
  createScatterPlot(organizedData, timestamps[0]);
}

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

function getCategoryLabel(category) {
  switch (category) {
    case "education":
      return "AmountSpentOnEducation";
    case "food":
      return "AmountSpentOnFood";
    case "recreation":
      return "AmountSpentOnRecreation";
    case "shelter":
      return "AmountSpentOnShelter";
    case "total":
      return "TotalAmountSpent";
    default:
      return "";
  }
}

function createMonthScatterPlot(data) {
  const width = 1000; // specify the desired width of the entire scatter plot
  const height = 800; // specify the desired height of the entire scatter plot

  const margin = { top: 20, right: 20, bottom: 20, left: 20 }; // specify margin values if needed

  const fullWidth = width - margin.left - margin.right;
  const fullHeight = height - margin.top - margin.bottom;

  // Get the keys (month + year) from the data
  const keys = Object.keys(data);

  // Set up the layout for the scatter plot grid
  const numRows = 3;
  const numCols = 5;

  // Calculate the width and height of each section
  const sectionWidth = fullWidth / numCols;
  const sectionHeight = fullHeight / numRows;

  d3.select("#detail-plot").selectAll(".x").remove(); // Remove existing x-axis
  d3.select("#detail-plot").selectAll(".y").remove(); // Remove existing x-axis
  d3.select("#detail-plot").select("svg").remove(); // Remove existing x-axis

  // Select the existing scatter plot sections
  const scatterSections = d3
    .select("#detail-plot")
    .append("svg")
    .attr("width", 1360)
    .attr("height", 860)
    .append("g")
    .attr("x", "20px")
    .attr("y", "20px")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")")
    .selectAll(".scatter-section")
    .data(keys);

  // Enter: create new sections
  const enterSections = scatterSections
    .enter()
    .append("g")
    .attr("class", "scatter-section")
    .attr("width", sectionWidth)
    .attr("heigth", sectionHeight)
    .attr("transform", (d, i) => {
      const row = Math.floor(i / numCols);
      const col = i % numCols;
      const xTranslate = col * sectionWidth + col * margin.left; // Add margin for space
      const yTranslate = row * sectionHeight + row * margin.top; // Add margin for space
      return `translate(${xTranslate},${yTranslate})`;
    });

  // Add the width and height attributes to the SVG elements
  enterSections
    .append("rect") // Add a rect to act as a background, adjust as needed
    .attr("width", sectionWidth / numCols)
    .attr("height", sectionHeight / numRows)
    .attr("x", margin.left)
    .attr("y", margin.top)
    .style("fill", "none"); // Transparent fill

  // let zoomedSectionContainer = d3.select("#zoomed-section");
  // Update: update existing and new sections
  const allSections = enterSections.merge(scatterSections);

  // Add click event listener to allSections
  allSections.on("click", function (event, key) {
    handleSectionClick(event, key, data[key]);
  });
  allSections.each(function (key) {
    const entriesForMonthYear = data[key];
    // Create scales for x and y based on your data
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(entriesForMonthYear, (d) => d[selectedCategory])])
      .range([0, sectionWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(entriesForMonthYear, (d) => d.Income)])
      .range([sectionHeight, 0]);
    // Select the existing circles in the current section
    const circles = d3
      .select(this)
      .selectAll("circle")
      .data(entriesForMonthYear);

    // Update existing circles
    circles.join(
      (enter) =>
        enter
          .append("circle")
          .attr("r", 5)
          .style("fill", "#69b3a2")
          .attr("cx", (d) => xScale(d[selectedCategory]))
          .attr("cy", (d) => yScale(d.Income))
          .call((enter) =>
            enter.transition().duration(1000).style("opacity", 1)
          ),
      (update) =>
        update
          .transition()
          .duration(1000)
          .attr("cx", (d) => xScale(d[selectedCategory]))
          .attr("cy", (d) => yScale(d.Income)),
      (exit) =>
        exit.call((exit) =>
          exit.transition().duration(1000).style("opacity", 0).remove()
        )
    );

    // Update x-axis and y-axis

    d3.select(this)
      .append("g")
      .attr("class", "x")
      .attr("transform", `translate(0, ${sectionHeight})`)
      .call(d3.axisBottom(xScale));

    d3.select(this).append("g").attr("class", "y").call(d3.axisLeft(yScale));
  });

  // Exit: remove sections that no longer have corresponding data
  scatterSections.exit().remove();
  console.log("here3");
}

function createZoomedScatterPlot(data) {
  // Clear the existing content in the zoomed section container
  zoomedSectionContainer.selectAll("*").remove();

  // Set up dimensions for the zoomed section
  const zoomedWidth = 500;
  const zoomedHeight = 400;
  const zoomedMargin = { top: 20, right: 20, bottom: 20, left: 20 };

  const zoomedSvg = zoomedSectionContainer
    .append("svg")
    .attr("width", zoomedWidth + zoomedMargin.left + zoomedMargin.right)
    .attr("height", zoomedHeight + zoomedMargin.top + zoomedMargin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + zoomedMargin.left + "," + zoomedMargin.top + ")"
    );

  // Create scales for x and y based on your data
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[selectedCategory])])
    .range([0, zoomedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Income)])
    .range([zoomedHeight, 0]);

  // Create circles for the scatter plot
  const circles = zoomedSvg.selectAll("circle").data(data);

  circles.join(
    (enter) =>
      enter
        .append("circle")
        .attr("cx", (d) => xScale(d[selectedCategory]))
        .attr("cy", (d) => yScale(d.Income))
        .attr("r", 5)
        .style("fill", "#69b3a2")
        .on("click", handleScatterClick) // Attach click event listener
        .on("mouseover", (event, d) => handleScatterHover(event, d)) // Attach hover event listener
        .on("mouseout", handleScatterMouseout) // Attach mouseout event listener
        .call((enter) => enter.transition().duration(1000).style("opacity", 1)),
    (update) =>
      update
        .transition()
        .duration(1000)
        .attr("cx", (d) => xScale(d[selectedCategory]))
        .attr("cy", (d) => yScale(d.Income)),
    (exit) =>
      exit.call((exit) =>
        exit.transition().duration(1000).style("opacity", 0).remove()
      )
  );

  // Add X and Y axes
  zoomedSvg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + zoomedHeight + ")")
    .call(d3.axisBottom(xScale));

  zoomedSvg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));
}
