.on("mouseover", function (event, d) {
    // Change color to red
    d3.select(this)
        .attr("fill", "red")
        .attr("r", 4); // Increase the radius as needed
    singlesvg.append("text")
        .attr("x", width / 2 + 300) // Position in the middle of the SVG
        .attr("y", height - 180) // Positioned below the chart
        .style("text-anchor", "middle") // Center the text
        .attr("class","task2_single_label")
        .text("ParticipantID : " + d.participantId);
    d3.select(".task2_single_label_clicked").style("visibility", "hidden")
})
.on("mouseout", function (event, d) {
    // Change back to the original color and radius

    if (!d3.select(this).classed("clicked")) {
        d3.select(this)
            .attr("fill", "blue")
            .attr("r", 2);
    }
    d3.select(".task2_single_label").remove()
    d3.select(".task2_single_label_clicked").style("visibility", "visible")
})
.on("click",async function(d,i){
    d3.select(".task2_single_label_clicked").remove()
    singlesvg.append("text")
        .attr("x", width / 2 + 300) // Position in the middle of the SVG
        .attr("y", height - 180) // Positioned below the chart
        .style("text-anchor", "middle") // Center the text
        .attr("class","task2_single_label_clicked")
        .text("ParticipantID : " + i.participantId);
    d3.selectAll(".data-point-single")
        .each(function () {
            d3.select(this)
                .attr("fill", "blue")
                .attr("r", 2);
          const classes = d3.select(this).attr("class"); // Get the current class string
          if (classes && classes.includes("clicked")) {
            // Remove the entire class string that includes "clicked"
            d3.select(this).attr("class", classes.replace(/\bclicked\b/g, '').trim());
          }
        });
    d3.select(this)
        .attr("r", "4")
        .attr("class", d3.select(this).attr("class") + " clicked")
        .attr("fill", "red");    
})