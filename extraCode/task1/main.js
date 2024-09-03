d3.csv("data/FilteredTravelJournal.csv").then(function (data) {
  const pubs = {};
  const restaurants = {};

  data.forEach(function (d) {
    const month = new Date(d.checkInTime).getMonth() + 1;
    const year = new Date(d.checkInTime).getFullYear();

    const revenue = d.startingBalance - d.endingBalance;

    const isPub = d.purpose.toLowerCase() === "recreation (social gathering)";
    const isRestaurant = d.purpose.toLowerCase() === "eating";

    const locationId = d.travelEndLocationId;

    const targetObject = isPub ? pubs : isRestaurant ? restaurants : null;

    if (!targetObject[month] && year === 2022) {
      targetObject[month] = {};
    } else if (!targetObject[month + 12] && year === 2023) {
      targetObject[month + 12] = {};
    }

    if (year === 2022) {
      if (targetObject[month][locationId]) {
        targetObject[month][locationId] += revenue;
      } else {
        targetObject[month][locationId] = revenue;
      }
    } else if (year === 2023) {
      if (targetObject[month + 12][locationId]) {
        targetObject[month + 12][locationId] += revenue;
      } else {
        targetObject[month + 12][locationId] = revenue;
      }
    }
    delete targetObject[2];
  });

  console.log(`Pubs:`, pubs);
  console.log(`Restaurants:`, restaurants);

  const combinedData = combineData(pubs, restaurants);

  const margin = { top: 20, right: 80, bottom: 60, left: 80 };
  const width = 820 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleLinear().range([10, width - 20]);
  const y = d3.scaleLinear().range([height, 0]);

  x.domain([3, 17]);
  y.domain([0, d3.max(combinedData, (d) => d.totalRevenue)]);

  const line = d3
    .line()
    .x((d) => x(d.month))
    .y((d) => y(d.totalRevenue))
    .curve(d3.curveLinear);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat((month) => getMonthName(month)));

  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("path")
    .data([combinedData.filter((d) => d.type === "pubs")])
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", "blue")
    .style("fill", "none");

  svg
    .append("path")
    .data([combinedData.filter((d) => d.type === "restaurants")])
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", "green")
    .style("fill", "none");

  svg
    .selectAll("circle")
    .data(combinedData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.month))
    .attr("cy", (d) => y(d.totalRevenue))
    .attr("r", 4)
    .style("fill", (d) => (d.type === "pubs" ? "blue" : "green"))
    .on("click", handleCircleClick);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Timeline");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Performance");

  const legend = svg
    .append("g")
    .attr("transform", "translate(" + (width - 20) + "," + 20 + ")")
    .attr("text-anchor", "end");

  const legendColors = { pubs: "blue", restaurants: "green" };

  legend
    .selectAll("rect")
    .data(["pubs", "restaurants"])
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 25)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => legendColors[d])
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  legend
    .selectAll("text")
    .data(["Pubs", "Restaurants"])
    .enter()
    .append("text")
    .attr("x", -5)
    .attr("y", (d, i) => i * 25 + 15)
    .attr("dy", "0.32em")
    .style("font-size", "14px")
    .style("font-family", "Arial, sans-serif")
    .text((d) => d);

  function combineData(pubs, restaurants) {
    const combinedData = [];
    for (let month = 3; month <= 17; month++) {
      combinedData.push({
        month,
        type: "pubs",
        totalRevenue: Object.values(pubs[month] || {}).reduce(
          (acc, val) => acc + val,
          0
        ),
        details: pubs[month] || {},
      });
      combinedData.push({
        month,
        type: "restaurants",
        totalRevenue: Object.values(restaurants[month] || {}).reduce(
          (acc, val) => acc + val,
          0
        ),
        details: restaurants[month] || {},
      });
    }
    return combinedData;
  }

  function getMonthName(month) {
    const months = [
      "Jan'22",
      "Feb 22",
      "Mar 22",
      "Apr 22",
      "May 22",
      "Jun 22",
      "Jul 22",
      "Aug 22",
      "Sep 22",
      "Oct 22",
      "Nov 22",
      "Dec 22",
      "Jan 23",
      "Feb 23",
      "Mar 23",
      "Apr 23",
      "May 23",
    ];
    return months[month - 1];
  }

  function handleCircleClick(event, d) {
    d3.select("#barChart").remove();

    if (d.details && Object.keys(d.details).length > 0) {
      displayBarChart(d.month, d.type, d.details);
    } else {
      console.log("No details available for this month and type.");
    }
  }

  function displayBarChart(month, type, details) {
    const barChartMargin = { top: 60, right: 20, bottom: 60, left: 70 };
    const barChartWidth = 600 - barChartMargin.left - barChartMargin.right;
    const barChartHeight = 400 - barChartMargin.top - barChartMargin.bottom;

    const barChart = d3
      .select("body")
      .append("svg")
      .attr("id", "barChart")
      .attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
      .attr(
        "height",
        barChartHeight + barChartMargin.top + barChartMargin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + barChartMargin.left + "," + barChartMargin.top + ")"
      );

    const xBar = d3.scaleBand().range([0, barChartWidth]).padding(0.1);
    const yBar = d3.scaleLinear().range([barChartHeight, 0]);

    xBar.domain(Object.keys(details));
    yBar.domain([0, d3.max(Object.values(details))]);

    barChart
      .append("g")
      .attr("transform", "translate(0," + barChartHeight + ")")
      .call(d3.axisBottom(xBar));

    barChart.append("g").call(d3.axisLeft(yBar));

    barChart
      .selectAll(".bar")
      .data(Object.entries(details))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xBar(d[0]))
      .attr("y", (d) => yBar(d[1]))
      .attr("width", xBar.bandwidth())
      .attr("height", (d) => barChartHeight - yBar(d[1]))
      .attr("fill", (d) => (type === "pubs" ? "blue" : "green"));

    const totalRevenue = d3.sum(Object.values(details)).toFixed(2);
    barChart
      .append("text")
      .attr("x", barChartWidth / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(`Total Revenue: $${totalRevenue}, Month: ${getMonthName(month)}`);

    barChart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - barChartMargin.left)
      .attr("x", 0 - barChartHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Individual Performance");

    barChart
      .append("text")
      .attr("x", barChartWidth / 2)
      .attr("y", barChartHeight + 37)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(type === "pubs" ? "Pubs" : "Restaurants");
  }
});
