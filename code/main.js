document.addEventListener("DOMContentLoaded", function () {
    const threeController = d3.select(".three_controller");
    let isMoved = false;
    const imageSource = 'BaseMap.png';
    const image = new Image();
    image.src = imageSource;
    const svgWidth = image.width
    const svgHeight = image.height
    threeController.selectAll(".Main_button")
        .on("mouseover", function(){
            d3.select(this)
                .style("background-color", "rgba(94, 68, 161, 255)")
                .style("color", "white")
                .style("box-shadow", "0 0 30px rgba(94, 68, 161, 0.5)")
                .style("cursor", "pointer");
        })
        .on("mouseout", function(){
            d3.select(this)
                .attr("style", "background-color: white")
        })
        .on("click", function (d) {
            // console.log(d.target.innerHTML);
            if (!isMoved) {
                threeController.transition()
                    .ease(d3.easeLinear)
                    .duration(300)
                    .style("transform", "translate(0,0)")
                    .on("end", function() {
                        if(d.target.innerHTML == "Employment Health"){
                            addSVGAndElements_task3(imageSource)
                        }
                        else if(d.target.innerHTML == "Resident Finances"){
                            addSVGAndElements_task2(imageSource)
                        }
                        else{
                            addSVGAndElements_task1(imageSource)
                        }
                    });
                isMoved = true;
            }
            else{
                if(d.target.innerHTML == "Employment Health"){
                    addSVGAndElements_task3(imageSource)
                }
                else if(d.target.innerHTML == "Resident Finances"){
                    addSVGAndElements_task2(imageSource)
                }
                else{
                    addSVGAndElements_task1(imageSource)
                }
            }
            threeController.selectAll(".Main_button:not(this)")
                    .classed("highlighted", true);
            d3.select(this)
                .classed("highlighted", false);
        });
    d3.select(".pubsCheckbox").on("change", function () {
        handleCheckBoxes_task1("Pubs");
    });
    d3.select(".schoolsCheckbox").on("change", function () {
        handleCheckBoxes_task1("Schools");
    });
    d3.select(".restaurantsCheckbox").on("change", function () {
        handleCheckBoxes_task1("Restaurants");
    });
});
function addSVGAndElements_task3(imageSource) {
    // d3.select(".baseMap").remove();
    // d3.select(".lineChart").remove();
    d3.select(".backButton").style("display", "none")
    d3.select(".grouped_scatter_plot_condition").style("display","none")
    d3.select(".task2_single_label_clicked").style("visibility","hidden")
    if (d3.select(".task3_main").style("visibility") === "hidden" && d3.select(".baseMap_task3").empty()) {
        d3.select(".task3_main").style("visibility", "visible");
        d3.select(".task2_main").style("visibility", "hidden");
        d3.select(".task1_main").style("visibility", "hidden");
    
        const img_cont = d3.selectAll(".image_container_task3")
            .style("display", "inline-flex");
        const LC_cont = d3.selectAll(".lineChartDiv_task3")
            .style("display", "inline-flex");
        img_cont.append("svg")
            .attr("class", "baseMap_task3")
            .attr("width", 380)
            .attr("height", 350);
        const svg = d3.select(".baseMap_task3");
        svg.append("image")
            .attr("xlink:href", imageSource)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 380)
            .attr("height", 350);

        
        var xScale = d3.scaleLinear()
        .domain([-4597.345294446435, 2630])
        .range([0, 380]);

        var yScale = d3.scaleLinear()
            .domain([418.7264799744545, 7836.545593061912])
            .range([350, 0]);
        
        d3.csv("../Data/Attributes/Employers.csv").then(function(data) {
            
            data.forEach(function(d) {
                var matchResult = d.location.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                if (matchResult) {
                    var coordinates = matchResult.slice(1).map(Number);
                    d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                    // console.log(d.location);
                } else {
                    console.error("Invalid location format:", d.location);
                }
            });

            svg.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("class","Empployees_task3")
                .attr("cx", function(d) { return d.location[0]; })
                .attr("cy", function(d) { return d.location[1]; })
                .attr("r", 2)
                .style("fill", "red")
                .on("mouseover", function(d, i) {
                    d3.select(this)
                        // .attr("fill", "red")
                        .attr("r", 4);
                    svg.append("text")
                        .attr("x", 270)
                        .attr("y", 40) 
                        .style("text-anchor", "middle")
                        .attr("class","task3_Employee_select")
                        .text("EmployeeID : " + i.employerId);
                    d3.select(".task3_Employee_select_clicked").style("visibility", "hidden")
                })
                .on("mouseout", function() {
                    if (!d3.select(this).classed("clicked")) {
                        d3.select(this)
                            // .attr("fill", "blue")
                            .attr("r", 2);
                    }
                    d3.select(".task3_Employee_select").remove()
                    d3.select(".task3_Employee_select_clicked").style("visibility", "visible")
                })
                .on("click", function(d,i){
                    // console.log(i)
                    // console.log(d)
                    d3.select(".task3_Employee_select_clicked").remove()
                    svg.append("text")
                        .attr("x", 270)
                        .attr("y", 40)
                        .style("text-anchor", "middle")
                        .attr("class","task3_Employee_select_clicked")
                        .text("EmployeeID : " + i.employerId);
                    d3.selectAll(".Empployees_task3")
                        .each(function () {
                            d3.select(this)
                                // .attr("fill", "blue")
                                .attr("r", 2);
                        const classes = d3.select(this).attr("class");
                        if (classes && classes.includes("clicked")) {
                            d3.select(this).attr("class", classes.replace(/\bclicked\b/g, '').trim());
                        }
                        });
                    d3.select(this)
                        .attr("r", "4")
                        .attr("class", d3.select(this).attr("class") + " clicked")

                    const currentColor = d3.select(this).style("fill");
                    if(currentColor === "blue"){
                        newColor = "red"
                        d3.selectAll(".linechart" + i.employerId).remove();
                    }
                    else{
                        newColor = "blue"
                        
                        var lineChartData = [];

                        async function fetchData() {
                        for (let p = 1; p < 16; p++) {
                            try {
                            const data = await d3.csv(`../Data/Task3/month${p}_count.csv`);
                            
                            data.forEach(function (k) {
                                if (k.employerId == i.employerId) {
                                lineChartData.push({ x: p, y: +k.number_of_employees }); 
                                }
                            });
                            } catch (error) {
                            console.error(`Error loading data for month ${p}:`, error);
                            }
                        }

                        // console.log(lineChartData);
                        d3.selectAll(".participant_task3").remove();
                        addLineChart(lineChartData,i.employerId);
                    }
                    fetchData();
                    }
                    d3.selectAll(".Empployees_task3").style("fill", "red");
                    d3.select(this).style("fill", newColor);
                    
                });
            
        })
        
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position","absolute")
            .style("visibility", "hidden");
        
    }
    else {
        d3.select(".task3_main").style("visibility", "visible");
        d3.select(".task2_main").style("visibility", "hidden");
        d3.select(".task1_main").style("visibility", "hidden");
    }
    // addLineChart([datadummy1])
}

function addSVGAndElements_task2(imageSource){
    if (d3.select(".singleScatterPlot_Parent").style("display") == "block") {
        d3.select(".backButton").style("display", "block");
    }
    else{
        d3.select(".grouped_scatter_plot_condition").style("display","block")
    }
    if (d3.select(".task2_main").style("visibility") === "hidden" && d3.select(".baseMap_task2").empty()) {   
        d3.select(".task2_main").style("visibility", "visible");
        d3.select(".task3_main").style("visibility", "hidden");
        d3.select(".task1_main").style("visibility", "hidden");

        const img_cont = d3.selectAll(".image_container_task2")
            .style("display", "inline-flex");
        const LC_cont = d3.selectAll(".lineChartDiv_task2")
            .style("display", "inline-flex");
        img_cont.append("svg")
            .attr("class", "baseMap_task2")
            .attr("width", 500)
            .attr("height", 500);
        const svg = d3.select(".baseMap_task2");
        svg.append("image")
            .attr("xlink:href", imageSource)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 500)
            .attr("height", 500);

        
        var xScale = d3.scaleLinear()
        .domain([-4628, 2494])
        .range([0, 500]);

        var yScale = d3.scaleLinear()
            .domain([39, 7843])
            .range([500, 0]);
        
        d3.csv("../Data/Task2/ParticipantDetails_Task2.csv").then(function(data) {
            let min = Number.MAX_VALUE
            let max = -1 * Number.MAX_VALUE

            data.forEach(function(d) {
                var matchResult = d.currentLocation.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                if (matchResult) {
                    var coordinates = matchResult.slice(1).map(Number);
                    d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                } else {
                    console.error("Invalid location format:", d.currentLocation);
                }
            });

            svg.selectAll(".circle")
                .data(data)
                .enter().append("circle")
                .attr("class",function(d) {
                    return "participant ParticipantID_" + d.participantId
                })
                .attr("cx", function(d) { 
                    if(d.location[0] <= 10){
                        return 100 - d.location[0]
                    }
                    else if(d.location[0] >= 490){
                        return 400 + d.location[0]
                    }
                    return d.location[0]; })
                .attr("cy", function(d) {
                    if(d.location[1] <= 10){
                        return 100 - d.location[1]
                    }
                    else if(d.location[1] >= 490){
                        return 400 + d.location[1]
                    }
                    return d.location[1]; })
                .attr("r", 1)
                .style("fill", "red")
                .on("mouseover", function(d, i) {
                    tooltip.style("visibility", "visible");
                    // console.log(d
                    tooltip.html("Partcipant ID: " + i.participantId)
                        .style("left", (220) + "px")
                        .style("top", (50) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                });
        

            let selectionRect;
            let startPoint = { x: 0, y: 0 };
            let endPoint_rect = { x: 0, y: 0 };
            let endPoint = { x: 0, y: 0 };
            
            let isDragging = false;
            
            function handleMouseDown(event) {
                startPoint = { x: event.clientX - 10, y: (event.clientY - 45)};
                // console.log(startPoint)
                if (selectionRect) selectionRect.remove();
            
                // Create a new selection rectangle
                selectionRect = svg.append("rect")
                .attr("x", startPoint.x)
                .attr("y", startPoint.y)
                .attr("width", 0)
                .attr("height", 0)
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .attr("class", "selection-rect");
            
                isDragging = true;
            }
            function handleMouseMove(event) {
                if (isDragging) {
                const currentPoint = { x: event.clientX - 10, y: event.clientY - 45};
                endPoint_rect = {
                    x: Math.min(startPoint.x, currentPoint.x),
                    y: Math.min(startPoint.y, currentPoint.y),
                };
                endPoint = {
                    x: currentPoint.x,
                    y: currentPoint.y,
                };
                const width = Math.abs(currentPoint.x - startPoint.x);
                const height = Math.abs(currentPoint.y - startPoint.y);
                selectionRect.attr("x", endPoint_rect.x)
                    .attr("y", endPoint_rect.y)
                    .attr("width", width)
                    .attr("height", height);
                }
            }
            function handleMouseUp() {
                isDragging = false;
                if (selectionRect) selectionRect.remove();
                selectPointsInArea();
            }               
            function selectPointsInArea() {
                let selectedParticipants = []
                const x1 = startPoint.x;
                const y1 = startPoint.y;
                const x2 = endPoint.x;
                const y2 = endPoint.y;
                
                // console.log(x1)
                // console.log(y1)
                // console.log(x2)
                // console.log(y2)
                // let svg = d3.select(".baseMap_task2");
                svg.selectAll(".participant")
                    .each(function (d) {
                        const cx = +d3.select(this).attr("cx");
                        const cy = +d3.select(this).attr("cy");
                        if (cx >= x1 && cy >= y1 && cx <= x2 && cy <= y2) {
                            let selectedPartcipantId = d3.select(this).attr("class").split(" ")[1].split('_')[1];
                            selectedParticipants.push(selectedPartcipantId)
                            d3.select(this).style("fill", "black");
                            }
                        else{
                            d3.select(this).style("fill", "red");
                        }
                        })
                // console.log(selectedParticipants)
                d3.select(".btn").node().click();
                addGroupedScatterPlot_task2(selectedParticipants)
            }
            svg.node().addEventListener("mousedown", handleMouseDown);
            svg.node().addEventListener("mousemove", handleMouseMove);
            svg.node().addEventListener("mouseup", handleMouseUp);
            
        })
        
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position","absolute")
            .style("visibility", "hidden");
        

        
    }
    else if (d3.select(".task2_main").style("visibility") === "hidden" && !d3.select(".baseMap_task2").empty()) {
        d3.select(".task2_main").style("visibility", "visible");
        d3.select(".task3_main").style("visibility", "hidden");
        d3.select(".task1_main").style("visibility", "hidden");
    }
}

function addSVGAndElements_task1(imageSource){
    d3.select(".backButton").style("display", "none")
    d3.select(".grouped_scatter_plot_condition").style("display","none")
    d3.select(".task2_single_label_clicked").style("visibility","hidden")
    if (d3.select(".task1_main").style("visibility") === "hidden" && d3.select(".baseMap_task1").empty()) {
        d3.select(".task1_main").style("visibility", "visible");
        d3.select(".task2_main").style("visibility", "hidden");
        d3.select(".task3_main").style("visibility", "hidden");

        const img_cont = d3.selectAll(".image_container_task1")
            .style("display", "inline-flex");
        img_cont.append("svg")
            .attr("class", "baseMap_task1")
            .attr("width", 500)
            .attr("height", 500);
        const svg = d3.select(".baseMap_task1");
        svg.append("image")
            .attr("xlink:href", imageSource)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 500)
            .attr("height", 500);
        let selectionRect;
        let startPoint = { x: 0, y: 0 };
        let endPoint_rect = { x: 0, y: 0 };
        let endPoint = { x: 0, y: 0 };
        
        let isDragging = false;
        
        function handleMouseDown(event) {
            startPoint = { x: event.clientX - 10, y: (event.clientY - 45)};
            // console.log(startPoint)
            if (selectionRect) selectionRect.remove();
        
            selectionRect = svg.append("rect")
            .attr("x", startPoint.x)
            .attr("y", startPoint.y)
            .attr("width", 0)
            .attr("height", 0)
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .attr("class", "selection-rect");
        
            isDragging = true;
        }
        

        function handleMouseMove(event) {
            if (isDragging) {
            const currentPoint = { x: event.clientX - 10, y: event.clientY - 45};
            endPoint_rect = {
                x: Math.min(startPoint.x, currentPoint.x),
                y: Math.min(startPoint.y, currentPoint.y),
            };
            endPoint = {
                x: currentPoint.x,
                y: currentPoint.y,
            };
            const width = Math.abs(currentPoint.x - startPoint.x);
            const height = Math.abs(currentPoint.y - startPoint.y);
            selectionRect.attr("x", endPoint_rect.x)
                .attr("y", endPoint_rect.y)
                .attr("width", width)
                .attr("height", height);
            }
        }
        

        function handleMouseUp() {
            isDragging = false;
            if (selectionRect) selectionRect.remove();
            selectPointsInArea();
        }
        
        
        async function selectPointsInArea() {
            let selectedPubs = []
            const x1 = startPoint.x;
            const y1 = startPoint.y;
            const x2 = endPoint.x;
            const y2 = endPoint.y;
            var initialData = [];
            for (let i = 1; i <= 15; i++) {
                initialData.push({ x: i, y: 0 });
            }
        
            let monthData = ["2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05"];
            let filePath = ""
            let business = [0,0,0]
            if (svg.select(".circles").attr("class").split(' ')[1].split('_')[0] == "pubs"){
                filePath = "../Data/Task1/task1_pub_final.csv"
                business = [1,0,0]
            }
            else if (svg.select(".circles").attr("class").split(' ')[1].split('_')[0] == "schools"){
                filePath = "../Data/Task1/task1_school_final.csv"
                business = [0,1,0];
            }
            else{
                filePath = "../Data/Task1/task1_restaurant_final.csv"
                business = [0,0,1];
            }

            function loadCSVData() {
                return new Promise((resolve, reject) => {
                    d3.csv(filePath).then(data => resolve(data)).catch(error => reject(error));
                });
            }
        
            try {
                const csvData = await loadCSVData();
        
                svg.selectAll(".circles")
                    .each(function (d) {
                        const cx = +d3.select(this).attr("cx");
                        const cy = +d3.select(this).attr("cy");
                        if (cx >= x1 && cy >= y1 && cx <= x2 && cy <= y2) {
                            let selectedPubId = d3.select(this).attr("class").split(" ")[2].split('_')[1];
                            selectedPubs.push(selectedPubId)
                            d3.select(this).style("fill", "black");
                            
                            if (business[0] == 1){
                                csvData.forEach(function (row) {
                                    if (JSON.stringify(row.pubId) == JSON.stringify(selectedPubId)) {
                                        initialData[monthData.indexOf(row.month)].y += parseFloat(row.total_revenue);
                                    }
                                });
                            }
                            else if (business[1] == 1){
                                csvData.forEach(function (row) {
                                    if (JSON.stringify(row.schoolId) == JSON.stringify(selectedPubId)) {
                                        initialData[monthData.indexOf(row.month)].y += parseFloat(row.total_revenue);
                                    }
                                });
                            }
                            else if (business[2] == 1){
                                csvData.forEach(function (row) {
                                    if (JSON.stringify(row.restaurantId) == JSON.stringify(selectedPubId)) {
                                        initialData[monthData.indexOf(row.month)].y += parseFloat(row.total_revenue);
                                    }
                                });
                            }
                        }
                    });
        
                addLineChart_task1(initialData,selectedPubs);
            } catch (error) {
                console.error("Error loading CSV data:", error);
            }
        }

        svg.node().addEventListener("mousedown", handleMouseDown);
        svg.node().addEventListener("mousemove", handleMouseMove);
        svg.node().addEventListener("mouseup", handleMouseUp);
    }
    else {
        d3.select(".task1_main").style("visibility", "visible");
        d3.select(".task2_main").style("visibility", "hidden");
        d3.select(".task3_main").style("visibility", "hidden");
    }
}
function handleCheckBoxes_task1(clickedItem){
    if(clickedItem == "Pubs"){
        const pubsCheckbox = d3.select(".pubsCheckbox");
        if (pubsCheckbox.property("checked")) {
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip_task1")
                .style("position","absolute")
                .style("visibility", "hidden");
            var xScale = d3.scaleLinear()
            .domain([-3903.194075780787, 1809.880173357865])
            .range([0, 500]); 

            var yScale = d3.scaleLinear()
                .domain([932.5852003214752, 6487.657688065099])
                .range([500, 0]);
            const svg = d3.select(".baseMap_task1")
            const pubsGroup = svg.append("g").attr("class", "pubs-group");
            d3.csv("../Data/Attributes/Pubs.csv").then(function(data) {
                data.forEach(function(d) {
                    var matchResult = d.location.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                    if (matchResult) {
                        var coordinates = matchResult.slice(1).map(Number);
                        d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                        // console.log(d.location);
                    } else {
                        console.error("Invalid location format:", d.location);
                    }
                });
                // console.log("Inside Pub")
                // pubsGroup = svg.select(".pubs-group");
                pubsGroup.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", (i) => {return "circles pubs_circles_task1 pubId_" + i.pubId})
                    .attr("cx", function(d) { 
                        if(d.location[0] <= 50){
                            return 100 - d.location[0]
                        }
                        else if(d.location[0] >= 450){
                            return 400 + d.location[0]
                        }
                        return d.location[0]; })
                    .attr("cy", function(d) {
                        if(d.location[1] <= 50){
                            return 100 - d.location[1]
                        }
                        else if(d.location[1] >= 450){
                            return 400 + d.location[1]
                        }
                        return d.location[1]; })
                    .attr("r", 4)
                    .style("fill", "red")
                    .on("mouseover", function(d, i) {
                        tooltip.style("visibility", "visible");
                        // console.log(d)
                        tooltip.html("Pub ID: " + i.pubId)
                            .style("left", (220) + "px")
                            .style("top", (50) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden");
                    });
                
            })
        } 
        else {
            // console.log("Unchecked")
            d3.selectAll(".pubs_circles_task1").remove();
        }
    }
    else if(clickedItem == "Schools"){
        const schoolsCheckbox = d3.select(".schoolsCheckbox");
        if (schoolsCheckbox.property("checked")) {
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip_task1")
                .style("position","absolute")
                .style("visibility", "hidden");
            var xScale = d3.scaleLinear()
            .domain([-4701.462928834322, 376.7505037068263])
            .range([0, 500]);

            var yScale = d3.scaleLinear()
                .domain([1607.9843212558562, 6556.0323181733565])
                .range([500, 0]);
            const svg = d3.select(".baseMap_task1");
            const schoolsGroup = svg.append("g").attr("class", "schools-group");
            d3.csv("../Data/Attributes/Schools.csv").then(function(data) {
                // Convert location strings to arrays of numbers
                data.forEach(function(d) {
                    var matchResult = d.location.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                    if (matchResult) {
                        var coordinates = matchResult.slice(1).map(Number);
                        d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                        // console.log(d.location);
                    } else {
                        console.error("Invalid location format:", d.location);
                    }
                });

                schoolsGroup.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", (i) => {return "circles schools_circles_task1 schoolId_" + i.schoolId})
                    .attr("cx", function(d) { 
                        if(d.location[0] == 0){
                            return 4
                        }
                        else if(d.location[0] == 500){
                            return 496
                        }
                        return d.location[0]; })
                    .attr("cy", function(d) {
                        if(d.location[1] == 0){
                            return 4
                        }
                        else if(d.location[1] == 500){
                            return 496
                        }
                        return d.location[1]; })
                    .attr("r", 4)
                    .style("fill", "blue")
                    .on("mouseover", function(d, i) {
                        tooltip.style("visibility", "visible");
                        // console.log(d)
                        tooltip.html("School ID: " + i.schoolId)
                            .style("left", (220) + "px")
                            .style("top", (50) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden");
                    });
                    
                
            })
        } 
        else {
            // console.log("Unchecked")
            d3.selectAll(".schools_circles_task1").remove();
        }
    }
    else if(clickedItem == "Restaurants"){
        const restaurantsCheckbox = d3.select(".restaurantsCheckbox");
        if (restaurantsCheckbox.property("checked")) {
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip_task1")
                .style("position","absolute")
                .style("visibility", "hidden");
            var xScale = d3.scaleLinear()
            .domain([-4131.41409222454, 1407.7107695149243])
            .range([0, 500]);

            var yScale = d3.scaleLinear()
                .domain([1194.128694228948, 7236.525633225643])
                .range([500, 0]);
            const svg = d3.select(".baseMap_task1");
            const restaurantsGroup = svg.append("g").attr("class", "restaurants-group");
            d3.csv("../Data/Attributes/Restaurants.csv").then(function(data) {
                data.forEach(function(d) {
                    var matchResult = d.location.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                    if (matchResult) {
                        var coordinates = matchResult.slice(1).map(Number);
                        d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                        // console.log(d.location);
                    } else {
                        console.error("Invalid location format:", d.location);
                    }
                });

                restaurantsGroup.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", (i) => {return "circles restaurants_circles_task1 restaurantId_" + i.restaurantId})
                    .attr("cx", function(d) { 
                        if(d.location[0] <= 50){
                            return 100 - d.location[0]
                        }
                        else if(d.location[0] >= 450){
                            return 400 + d.location[0]
                        }
                        return d.location[0]; })
                    .attr("cy", function(d) {
                        if(d.location[1] <= 50){
                            return 100 - d.location[1]
                        }
                        else if(d.location[1] >= 450){
                            return 400 + d.location[1]
                        }
                        return d.location[1]; })
                    .attr("r", 4)
                    .style("fill", "green")
                    .on("mouseover", function(d, i) {
                        tooltip.style("visibility", "visible");
                        // console.log(d)
                        tooltip.html("Restaurant ID: " + i.restaurantId)
                            .style("left", (220) + "px")
                            .style("top", (50) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden");
                    });
                
            })
        } 
        else {
            // console.log("Unchecked")
            d3.selectAll(".restaurants_circles_task1").remove();
        }
    }
}

function addLineChart(dataDummy,empId) {
    const data = dataDummy
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 1020 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
    const xScaleLine = d3.scaleLinear()
            .domain([0, 15])
            .range([0, width - 100]);
    const yScaleLine = d3.scaleLinear()
        .domain([0, 30])
        .range([height, 50]);
    const line = d3.line()
        .x(d => xScaleLine(d.x))
        .y(d => yScaleLine(d.y));
    let svg_dummy = d3.select(".lineChart").remove()
    // svg_dummy.remove();
    let tooltip_lineChart;
    // if (svg_dummy.empty()) {
        svg = d3.select(".lineChartDiv_task3")
            .style("display", "inline-flex")
            .append("svg")
            .attr("class", "lineChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class","task3_lineChart_g")
            .attr("transform", `translate(${margin.left + 50},${margin.top - 50})`);
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScaleLine));
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScaleLine)); 
        tooltip_lineChart = d3.select("body")
            .append("div")
            .attr("class", "tooltip_linechart")
            .style("position","absolute")
            .style("visibility", "hidden");
    // }


    const circles = svg.selectAll(".cir" + empId)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "linechart_task3_circle linechart" + empId + " cir" + empId)
        .attr("cx", d => xScaleLine(d.x))
        .attr("cy", d => yScaleLine(d.y))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .on("mouseover", function(d, i) {
            d3.select(this)
                // .attr("fill", "red")
                .attr("r", 7);
            console.log(svg);
            svg.append("text")
                .attr("x", 520)
                .attr("y", 50)
                .style("text-anchor", "middle")
                .attr("class","task3_lineChart_tooltip")
                .text("Employee ID: " + empId + " Month: " + i.x);
            d3.select(".task3_lineChart_tooltip_clicked").style("visibility", "hidden")
        })
        .on("mouseout", function() {
            if (!d3.select(this).classed("clicked")) {
                d3.select(this)
                    // .attr("fill", "blue")
                    .attr("r", 4);
            }
            d3.select(".task3_lineChart_tooltip").remove()
            d3.select(".task3_lineChart_tooltip_clicked").style("visibility", "visible")

        })
        .on("click", function(d,i){
            d3.select(".task3_lineChart_tooltip_clicked").remove();
            // svg = d3.select(".task3_lineChart_g")
            d3.select(".task3_lineChart_g").append("text")
                .attr("x", 520)
                .attr("y", 50)
                .style("text-anchor", "middle")
                .attr("class","task3_lineChart_tooltip")
                .text("Employee ID: " + empId + " Month: " + i.x);
            d3.selectAll(".linechart_task3_circle")
                .each(function () {
                    d3.select(this)
                        // .attr("fill", "blue")
                        .attr("r", 4);
                const classes = d3.select(this).attr("class");
                if (classes && classes.includes("clicked")) {
                    d3.select(this).attr("class", classes.replace(/\bclicked\b/g, '').trim());
                }
                });
            d3.select(this)
                .attr("r", "7")
                .attr("class", d3.select(this).attr("class") + " clicked")


            let monthData = ["2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05"];
            let currentMonth = monthData[i.x-1]
            // console.log(currentMonth)
            // console.log(empId)
            const uniqueParticipantIds = new Set();
            inputFile = "../Data/Task3/task3_atWork.csv"
            d3.csv(inputFile)
                .then(data => {
                    data.forEach(row => {
                    if (row.venueId === empId && row.timestamp.includes(currentMonth)) {
                        uniqueParticipantIds.add(row.participantId);
                    }
                    });

                const uniqueParticipantIdsArray = Array.from(uniqueParticipantIds);

                // console.log(uniqueParticipantIdsArray);
                d3.select(".baseMap_task3_participants").remove()
                const img_cont = d3.select(".image_container_task3_participants")
                    .style("display", "inline-flex");
                img_cont.append("svg")
                    .attr("class", "baseMap_task3_participants")
                    .attr("width", 380)
                    .attr("height", 350);
                const svg = d3.select(".baseMap_task3_participants");
                const imageSource = 'BaseMap.png';
                const image = new Image();
                image.src = imageSource;
                svg.append("image")
                    .attr("href", imageSource)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 380)
                    .attr("height", 350);

                
                var xScale = d3.scaleLinear()
                .domain([-4628, 2494])
                .range([0, 380]);

                var yScale = d3.scaleLinear()
                    .domain([39, 7843])
                    .range([350, 0]);
                
                d3.csv("../Data/Task2/ParticipantDetails_Task2.csv").then(function(data) {
                    let min = Number.MAX_VALUE
                    let max = -1 * Number.MAX_VALUE
                    data.forEach(function(d) {
                        var matchResult = d.currentLocation.match(/(-?\d+\.\d+)\s(-?\d+\.\d+)/);

                        if (matchResult) {
                            var coordinates = matchResult.slice(1).map(Number);
                            d.location = [xScale(coordinates[0]), yScale(coordinates[1])];
                        } else {
                            console.error("Invalid location format:", d.currentLocation);
                        }
                    });

                    svg.selectAll(".circle")
                        .data(data.filter(d => uniqueParticipantIdsArray.includes(d.participantId)))
                        .enter()
                        .append("circle")
                        .attr("class", function(d) {
                            return "participant_task3 task3_ParticipantID_" + d.participantId;
                        })
                        .attr("cx", function(d) {
                            if (d.location[0] <= 10) {
                                return 100 - d.location[0];
                            } else if (d.location[0] >= 490) {
                                return 400 + d.location[0];
                            }
                            return d.location[0];
                        })
                        .attr("cy", function(d) {
                            if (d.location[1] <= 10) {
                                return 100 - d.location[1];
                            } else if (d.location[1] >= 490) {
                                return 400 + d.location[1];
                            }
                            return d.location[1];
                        })
                        .attr("r", 3)
                        .style("fill", "blue")
                        .on("mouseover", function(d, i) {
                            d3.select(this)
                                .attr("fill", "red")
                                .attr("r", 4);
                            d3.select(".baseMap_task3_participants").append("text")
                                .attr("x", 240)
                                .attr("y", 40)
                                .style("text-anchor", "middle")
                                .attr("class","task3_participant_hover")
                                .text("ParticipantID : " + i.participantId);
                        })
                        .on("mouseout", function() {
                            d3.select(this)
                                .attr("fill", "blue")
                                .attr("r", 3);
                            // d3.select(".task3_participant_hover").remove()
                        });
                    
                    })
                    
                })
                .catch(error => console.error('Error:', error)); 
            var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 1025 - margin.left - margin.right,
            height = 345 - margin.top - margin.bottom;  
            
            var formatNumber = d3.format(",.0f"),
                format = function(d) { return formatNumber(d); },
                color = d3.scaleOrdinal(d3.schemeCategory10);
            d3.select(".SankeySVG").remove();
            var svg = d3.select(".my_dataviz").append("svg")
                .attr("class", "SankeySVG")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");
            
            
            d3.csv("sankey.csv").then(function(data) {
            var sankey = d3.sankey()
                .nodeWidth(36)
                .nodePadding(40)
                .size([width, height]);
            
            var path = sankey.links();
              sankeydata = {"nodes" : [], "links" : []};
            
              data.forEach(function (d) {
                sankeydata.nodes.push({ "name": d.source });
                sankeydata.nodes.push({ "name": d.target });
                sankeydata.links.push({ "source": d.source,
                                   "target": d.target,
                                   "value": +d.value });
               });
            
             sankeydata.nodes = Array.from(
                d3.group(sankeydata.nodes, d => d.name),
                ([value]) => (value)
              );
            
              sankeydata.links.forEach(function (d, i) {
                sankeydata.links[i].source = sankeydata.nodes
                  .indexOf(sankeydata.links[i].source);
                sankeydata.links[i].target = sankeydata.nodes
                  .indexOf(sankeydata.links[i].target);
              });
            
              sankeydata.nodes.forEach(function (d, i) {
                sankeydata.nodes[i] = { "name": d };
              });
            
              graph = sankey(sankeydata);
            
              var link = svg.append("g").selectAll(".link")
                  .data(graph.links)
                .enter().append("path")
                  .attr("class", "link")
                  .attr("d", d3.sankeyLinkHorizontal())
                  .attr("stroke-width", function(d) { return d.width; });  
            
              link.append("title")
                    .text(function(d) {
                            return d.source.name + " → " + 
                            d.target.name + "\n" + format(d.value); });
            
              var node = svg.append("g").selectAll(".node")
                  .data(graph.nodes)
                .enter().append("g")
                  .attr("class", "node");
            
              node.append("rect")
                  .attr("x", function(d) { return d.x0; })
                  .attr("y", function(d) { return d.y0; })
                  .attr("height", function(d) { return d.y1 - d.y0; })
                  .attr("width", sankey.nodeWidth())
                  .style("fill", function(d) { 
                          return d.color = color(d.name.replace(/ .*/, "")); })
                  .style("stroke", function(d) { 
                      return d3.rgb(d.color).darker(2); })
                  .append("title")
                  .text(function(d) { 
                      return d.name + "\n" + format(d.value); });
            
              node.append("text")
                  .attr("x", function(d) { return d.x0 - 6; })
                  .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                  .attr("dy", "0.35em")
                  .attr("text-anchor", "end")
                  .text(function(d) { return d.name; })
                .filter(function(d) { return d.x0 < width / 2; })
                  .attr("x", function(d) { return d.x1 + 6; })
                  .attr("text-anchor", "start");
            
            });

        })

    const paths = svg.append("path")
        .datum(data)
        .attr("class", "linechart" + empId + " line" + empId)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .on("mouseover", function(d, i) {
            tooltip_lineChart.style("visibility", "visible");
            // console.log(d)
            tooltip_lineChart.html("Employee ID: " + empId)
                .style("left", (920) + "px")
                .style("top", (50) + "px");
        })
        .on("mouseout", function() {
            tooltip_lineChart.style("visibility", "hidden");
        });
    svg.append("text")
        .attr("x", width / 2 - 20)
        .attr("y", height + margin.bottom + 20)
        .style("text-anchor", "middle")
        .text("Month");
    
    svg.append("text")
        .attr("x", -margin.left - 120)
        .attr("y", height / 2 - 200)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Employees");
}
function addLineChart_task1(dataDummy,selectedPubs) {
    let min = Number.MAX_VALUE;
    let max = 0
    for(let i = 0;i<15;i++){
        if(dataDummy[i].y > max){
            max = dataDummy[i].y
         }
        if(dataDummy[i].y < min){
            min = dataDummy[i].y
        }
    }
    // console.log(min)
    // console.log(max)
    const data = dataDummy
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 850 - margin.left - margin.right;
    const height = 440 - margin.top - margin.bottom;
    
    const xScaleLine = d3.scaleLinear()
            .domain([0, 15])
            .range([120, width]);
    // const yScaleLine = d3.scaleLinear()
    //     .domain([min-1000, max+1000])
    //     .range([height, 0]);
    const yScaleLine = d3.scaleLinear()
        .domain([1350, 103530])
        // .domain([1350, 20490])
        .range([height - 20, 0]);
    const line = d3.line()
        .x(d => xScaleLine(d.x))
        .y(d => yScaleLine(d.y/selectedPubs.length));
    let svgDiv = d3.select(".lineChartSVG_task1");
    let tooltip_lineChart;
    let svg = d3.select(".lineChartDiv_task1")
    if (svgDiv.empty()) {
        svg = d3.select(".lineChartDiv_task1")
            .style("display", "inline-flex")
            .append("svg")
                .attr("class", "lineChartSVG_task1")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "finalLinechart")
                .attr("transform", `translate(${margin.left - 20},${margin.top - 10})`);
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - 20})`)
            .call(d3.axisBottom(xScaleLine));
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(120, 0)")
            .call(d3.axisLeft(yScaleLine));
        svg.append("text")
            .attr("x", 0)
            .attr("y", 220)
            .text("Average")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");
        svg.append("text")
            .attr("x", 0)
            .attr("y", 240)
            .text("Revenue")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");
        svg.append("text")
            .attr("x", 400)
            .attr("y", 410)
            .text("Month")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");

        tooltip_lineChart = d3.select("body")
            .append("div")
            .attr("class", "tooltip_linechart")
            .style("position","absolute")
            .style("visibility", "hidden");
    }
    let g = d3.select(".finalLinechart").append("g")
        .attr("class", "g")
    const circles = g.selectAll(".cir")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "cir")
        .attr("cx", d => xScaleLine(d.x))
        .attr("cy", d => yScaleLine(d.y/selectedPubs.length))
        .attr("r", 4)
        .attr("fill", () => {
            const pubsChecked = d3.select(".pubsCheckbox").property("checked");
            const restaurantsChecked = d3.select(".restaurantsCheckbox").property("checked");
        
            if (pubsChecked && restaurantsChecked) {
                return "steelblue";
            } else if (pubsChecked) {
                return "red";
            } else if (restaurantsChecked) {
                return "green";
            }
        })
        .on("mouseover", function () {
            d3.select(this)
                .attr("r", 8);
        })
        .on("mouseout", function () {
            if (!d3.select(this).classed("clicked")) {
                d3.select(this)
                    .attr("r", 4);
            }
        })
        .on("click", function (d, i) {
            d3.selectAll(".cir")
                .classed("clicked", false)
                .attr("r",4);
            d3.select(this)
                .classed("clicked", true)
                .attr("r", 8);
            addBarChart_task1(selectedPubs, i.x);
        });

    const paths = g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", () => {
            const pubsChecked = d3.select(".pubsCheckbox").property("checked");
            const restaurantsChecked = d3.select(".restaurantsCheckbox").property("checked");
        
            if (pubsChecked && restaurantsChecked) {
                return "steelblue";
            } else if (pubsChecked) {
                return "red";
            } else if (restaurantsChecked) {
                return "green";
            }
        })
}
function addBarChart_task1(selectedPubs, month_index) {
    let monthData = ["2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05"];
    month = monthData[month_index - 1];
    // console.log(selectedPubs)
    async function fetchData() {
        try {
            const csvDataPub = await d3.csv("../Data/Task1/task1_pub_final.csv");
            const data = [];

            selectedPubs.forEach(pubId => {
                const filteredData = csvDataPub.filter(d => d.pubId === pubId && d.month === month);
                if (filteredData.length > 0) {
                    const revenue = +filteredData[0].total_revenue;
                    data.push({
                        pubId: pubId,
                        revenue: revenue
                    });
                } else {
                    console.log(`No data found for pubId ${pubId} in month ${month}`);
                }
            });
            const csvDataRestaurant = await d3.csv("../Data/Task1/task1_restaurant_final.csv");

            selectedPubs.forEach(pubId => {
                const filteredData = csvDataRestaurant.filter(d => d.restaurantId === pubId && d.month === month);
                if (filteredData.length > 0) {
                    const revenue = +filteredData[0].total_revenue;
                    data.push({
                        pubId: pubId,
                        revenue: revenue
                    });
                } else {
                    console.log(`No data found for pubId ${pubId} in month ${month}`);
                }
            });

            // console.log(data); 
            createBarChart(data);
        } catch (error) {
            console.error("Error loading CSV file:", error);
        }
    }

    fetchData();

    function createBarChart(data) {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 850 - margin.left - margin.right;
        const height = 260 - margin.top - margin.bottom;

        d3.select(".BarChartSVG").remove();
        const svg = d3.select(".barChartDiv_task1")
            .append("svg")
            .attr("class", "BarChartSVG")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            // .attr("transform", `translate(${margin.left},${margin.top})`);
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.pubId))
            .range([140, width])
            .padding(0.1);

        const paddingPercentage = 30;
        const dataRange = d3.max(data, d => d.revenue) - d3.min(data, d => d.revenue);
        const padding = dataRange * (paddingPercentage / 100);
        
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.revenue) - padding, d3.max(data, d => d.revenue) + padding])
            .range([height, 10]);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .attr("transform", `translate(400,${height + 40})`)
            .append("text")
                .text("ID")
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "black");
        svg.append("text")
            .attr("x", 20)
            .attr("y", 120)
            .text("Revenue")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "black");
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(140, 0)")
            .call(d3.axisLeft(yScale));
        

        // Create bars
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.pubId))
            .attr("y", d => yScale(d.revenue))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.revenue))
            .attr("fill", d => {
                if (["442", "443", "444", "892", "893", "894", "1342", "1343", "1344", "1798", "1799", "1800"].includes(d.pubId)) {
                    return "red";
                } else {
                    return "green";
                }
            });
    }
}
function addGroupedScatterPlot_task2(selectedParticipants){
    // console.log(selectedParticipants)
    d3.select(".GroupedScatterPlot_task2").style("visibility", "visible");
    d3.selectAll(".GroupedScatterPlotSVG").remove()
    d3.selectAll(".GroupedScatterPlotDiv")
    .each(async function(d, i) {
        var parentDiv = d3.select(this);
        parentDiv
        .on("mouseover", function() {
            d3.select(this).style("border", "2px solid black");
        })
        .on("mouseout", function() {
            d3.select(this).style("border", "1px solid black");
        })
        .on("click", async function() {
            let clickedElement = d3.select(this);
            let clickedMonth = clickedElement.attr("class").split(" ")[0].split("_")[1];
            d3.select(".btn-danger").style("display" , "block")
            const response1 = await fetch('../Data/Task2/task2_participant_final.csv');
            const csvData1 = await response1.text();
            let data1 = await returnGroupedScatterPlotData(selectedParticipants,clickedMonth,csvData1)
            let xMin = d3.min(data1, d => d.income);
            let xMax = d3.max(data1, d => d.income);
            let yMax = -1 * d3.min(data1, d => d.spending);
            let yMin = -1 * d3.max(data1, d => d.spending);
            let xPadding = 0.1 * (xMax - xMin);
            let yPadding = 0.1 * (yMax - yMin);
            d3.select(".singleScatterPlotMiddleSVG").remove()
            let singlesvg = d3.select(".singleScatterPlotMiddleDiv")
                .append("svg")
                .attr("class", "singleScatterPlotMiddleSVG")
                .attr("width", "100%")
                .attr("height", "100%")
                .append("g")
                .attr("class","singlePlotScatter")
                .attr("transform", "translate(50,-20)")

            let svgWidthsingle = 500;
            let svgHeightsingle = 340;

            
            let marginsngle = { top: 5, right: 5, bottom: 5, left: 5 };
            let widthsingle = svgWidthsingle - marginsngle.left - marginsngle.right;
            let heightsingle = svgHeightsingle - marginsngle.top - marginsngle.bottom;

            
            let xScalesingle = d3.scaleLinear()
                .domain([xMin - xPadding, xMax + xPadding])
                .range([10, widthsingle - 50]);

            let yScalesingle = d3.scaleLinear()
                .domain([yMin - yPadding, yMax + yPadding])
                .range([heightsingle, marginsngle.top + 50]);

            
            let xAxissingle = d3.axisBottom(xScalesingle);

            
            let yAxissingle = d3.axisLeft(yScalesingle);

            
            singlesvg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(40," + heightsingle + ")")
                .call(xAxissingle);

            singlesvg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + (marginsngle.left + 45) + ",0)")
                .call(yAxissingle);

            
            singlesvg.selectAll(".data-point")
                .data(data1)
                .enter().append("circle")
                .attr("class", (d)=>{
                    return "data-point-single data-point_" + d.participantId
                })
                .attr("cx", d => xScalesingle(d.income) + 40)
                .attr("cy", d => yScalesingle(-1 * d.spending))
                .attr("r", 2)
                .attr("fill", "blue")
                .on("mouseover", function (event, d) {
                    
                    d3.select(this)
                        .attr("fill", "red")
                        .attr("r", 4);
                    singlesvg.append("text")
                        .attr("x", width / 2 + 300)
                        .attr("y", height - 180)
                        .style("text-anchor", "middle")
                        .attr("class","task2_single_label")
                        .text("ParticipantID : " + d.participantId);
                    d3.select(".task2_single_label_clicked").style("visibility", "hidden")
                })
                .on("mouseout", function (event, d) {

                    if (!d3.select(this).classed("clicked")) {
                        d3.select(this)
                            .attr("fill", "blue")
                            .attr("r", 2);
                    }
                    d3.select(".task2_single_label").remove()
                    d3.select(".task2_single_label_clicked").style("visibility", "visible")
                })
                .on("click",async function(d,i){
                    d3.select(".innovativeVisSVG").remove()
                    d3.select(".task2_single_label_clicked").remove()
                    singlesvg.append("text")
                        .attr("x", width / 2 + 300) 
                        .attr("y", height - 180) 
                        .style("text-anchor", "middle")
                        .attr("class","task2_single_label_clicked")
                        .text("ParticipantID : " + i.participantId);
                    d3.selectAll(".data-point-single")
                        .each(function () {
                            d3.select(this)
                                .attr("fill", "blue")
                                .attr("r", 2);
                          const classes = d3.select(this).attr("class");
                          if (classes && classes.includes("clicked")) {
                            d3.select(this).attr("class", classes.replace(/\bclicked\b/g, '').trim());
                          }
                        });
                    d3.select(this)
                        .attr("r", "4")
                        .attr("class", d3.select(this).attr("class") + " clicked")
                        .attr("fill", "red");
                    
                    let singleMin = Math.min(xMin,yMin)
                    let singleMax = Math.max(xMax,yMax)
                    const response1 = await fetch('../Data/Task2/task2_participant_final.csv');
                    const csvData1 = await response1.text();
                    let datasingle = await returnGroupedScatterPlotData([i.participantId],clickedMonth,csvData1)
                    let currentParticipant = i.participantId;
                    datasingle = datasingle[0]
                    datasingle.spending = datasingle.spending * -1
                    var widthtask2bar = 360;
                    var heighttask2bar = 350;
                    
                    d3.select(".barchart_incomespending_SVG").remove();
                    var svgtask2bar = d3.select(".barchart_incomespending")
                        .append("svg")
                        .attr("class", "barchart_incomespending_SVG")
                        .attr("width", "100%")
                        .attr("height", "100%");

                    var margintask2bar = { top: 5, right: 0, bottom: 10, left: 20 };
                    widthtask2bar -= margintask2bar.left + margintask2bar.right;
                    heighttask2bar -= margintask2bar.top + margintask2bar.bottom;

                    var xScaletask2bar = d3.scaleBand()
                        .domain(["income", "spending"])
                        .range([0, widthtask2bar-100])
                        .padding(0.1);

                    var yScaletask2bar = d3.scaleLinear()
                        .domain([singleMin - 1000,singleMax])
                        .range([heighttask2bar, 20]);

                    svgtask2bar.selectAll("rect")
                        .data(["income", "spending"])
                        .enter()
                        .append("rect")
                        .attr("x", d => xScaletask2bar(d) + 50)
                        .attr("y", d => yScaletask2bar(datasingle[d]))
                        .attr("width", xScaletask2bar.bandwidth())
                        .attr("height", d => heighttask2bar - yScaletask2bar(datasingle[d]))
                        .attr("fill", function(d) { return d === "income" ? "blue" : "red"; })
                        .on("click",function(d,i){
                            if (i == "spending"){
                                createInnovativeVis(currentParticipant,clickedMonth);
                            }
                        });

                    svgtask2bar.append("g")
                        .attr("transform", "translate(50," + heighttask2bar + ")")
                        .call(d3.axisBottom(xScaletask2bar));

                    svgtask2bar.append("g")
                        .attr("transform", "translate(50,0)")
                        .call(d3.axisLeft(yScaletask2bar));

                    
                })
            singlesvg.append("text")
                .attr("x", width / 2 + 160)
                .attr("y", height + 140)
                .style("text-anchor", "middle")
                .attr("class", "xlabel")
                .text("Income");
            d3.select(".singleScatterPlotMiddleSVG").append("text")
                .attr("x", -150)
                .attr("y", 50)
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("class", "ylabel")
                .text("Spending");
    

            d3.select(".btn-danger")
                .on("click", ()=>{
                    d3.select(".grouped_scatter_plot_condition").style("display", "block")
                    d3.select(".singleScatterPlot_Parent").style("display", "none")
                    d3.select(".btn-danger").style("display" , "none")
                    d3.select(".barchart_incomespending_SVG").remove();
                    d3.select(".innovativeVisSVG").remove();
                })
            d3.select(".grouped_scatter_plot_condition").style("display", "none")
            d3.select(".singleScatterPlot_Parent").style("display", "block")
        });
        var svg = parentDiv
            .append("svg")
            .attr("class", function() {
                return "month_" + (i + 1) + "_svg GroupedScatterPlotSVG";
            })
            .attr("width", "100%")
            .attr("height", "100%");
        const response = await fetch('../Data/Task2/task2_participant_final.csv');
        const csvData = await response.text();
        var data = await returnGroupedScatterPlotData(selectedParticipants,i,csvData)
        // console.log(data)
        var svgWidth = 180;
        var svgHeight = 240;
    
        var margin = { top: 5, right: 5, bottom: 5, left: 5 };
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;
    
        // Create SVG container
        // var svg = d3.select("#scatter-plot")
        // .attr("width", svgWidth)
        // .attr("height", svgHeight);
    
        var xScale = d3.scaleLinear()
        .domain([1280, 21340])
        .range([margin.left, width]);
    
        var yScale = d3.scaleLinear()
        .domain([30, 4900])
        .range([height, margin.top]);
    
        var xAxis = d3.axisBottom(xScale);
    
        var yAxis = d3.axisLeft(yScale);
    
        svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
        svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);
    
        svg.selectAll(".data-point")
        .data(data)
        .enter().append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(-1 * d.spending))
        .attr("r", 2)
        .attr("fill","blue");  
    });

}

async function returnGroupedScatterPlotData(selectedParticipants, monthNumber, csvData) {
    const data = [];

    const monthData = ["2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05"];
    const month = monthData[monthNumber];

    csvData
      .split('\n')
      .slice(1)
      .forEach((row) => {
        const columns = row.split(',');

        if (selectedParticipants.includes(columns[1]) && columns[0] === month) {
          const spending =
            parseFloat(columns[3]) +
            parseFloat(columns[4]) +
            parseFloat(columns[5]) +
            parseFloat(columns[6]) +
            parseFloat(columns[7]);

          data.push({
            participantId: columns[1],
            income: parseFloat(columns[2]),
            spending: spending,
          });
        }
      });

    // console.log(month);
    // console.log(data);
    return data
}

async function createInnovativeVis(currentParticipant,monthNumber){
    const response = await fetch('../Data/Task2/task2_participant_final.csv');
    const csvData = await response.text();

    const data = [];

    const monthData = ["2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05"];
    const month = monthData[monthNumber];
    var width = 530;
    var height = 350;
    var radius = 100;




    var length_of_line = radius + 50;
    csvData
      .split('\n')
      .slice(1)
      .forEach((row) => {
        const columns = row.split(',');

        if (currentParticipant == columns[1] && columns[0] === month) {
          data.push({
            participantId: currentParticipant,
            Education:parseFloat(columns[4]) * -1,
            Food:parseFloat(columns[5])* -1,
            Shelter:parseFloat(columns[6])* -1,
            Recreation:parseFloat(columns[7])* -1,
            month:columns[0]
          });
        }
      });
    var dataArray = [data[0].Education,data[0].Food,data[0].Shelter,data[0].Recreation]
    // var dataArray = [30, 40, 30,40];
    var colors = ['#FF6384', '#36A2EB', '#FFCE56','#83b876'];
    sortOrder = ["Education", "Food", "Shelter", "Recreation"];
    dataArray.sort(function (a, b) {
    return sortOrder.indexOf(a.label) - sortOrder.indexOf(b.label);
    });
    var color = d3.scaleOrdinal()
            .range(colors)
    var hoverText_donut = ["Education: " + dataArray[0].toFixed(2),"Food: " + dataArray[1].toFixed(2),"Shelter: " + dataArray[2].toFixed(2),"Recreation: " + dataArray[3].toFixed(2)]
    d3.select(".innovativeVisSVG").remove()
    var svg = d3.select(".innovativeVis")
                .append("svg")
                .attr("class", "innovativeVisSVG")
                .attr("width", width)
                .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    var arc = d3.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius);
    var pie = d3.pie()
                .sort(null) 
                .value(function (d) {return d;})
    var arcs = svg.selectAll(".arc")
                .data(pie(dataArray))
                .enter()
                .append("g")
                .attr("class","arc")
                    .append("path")
                    .attr("d",arc)
                    .attr("id",function (d,i) {return sortOrder[i]})
                    .attr("stroke-width", "1")
                    .attr("stroke", "black")
                    .attr("fill", function (d,i) {
                        return color(i);})
                    .on("mouseover", function () {
                        var hoveredData = d3.select(this).datum();
                        svg.append("text")
                            .attr("x","5")
                            .attr("y","10")
                            .attr("id", "HoverCountText")
                            .attr("text-anchor", "middle")
                            .attr("fill", "black")
                            .attr("font-size", "14px")
                            .text(function () {
                                return hoverText_donut[hoveredData.index];})
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("stroke-width",4)
                    })
                    .on("mouseout", function () {
                        d3.select("#HoverCountText").remove()
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("stroke-width",1)
                    })
                    .on("click", async function(d,k) {
                        // console.log(d.target.id)
                        // console.log(k)

                        let itemCondition;
                        if(d.target.id == "Food"){
                            itemCondition = "Eating"
                        }
                        else if(d.target.id == "Recreation"){
                            itemCondition = "Recreation (Social Gathering)"
                        }
                        const responseInnovative = await fetch('../Data/Journals/TravelJournal.csv');
                        const csvDataInnovative = await responseInnovative.text();

                        const dataInnovative = [];

                        csvDataInnovative
                            .split('\n')
                            .slice(1)
                            .forEach((row) => {
                                const columns = row.split(',');
                                if (
                                  currentParticipant == columns[0] &&
                                  columns[1].includes(month) &&
                                  columns[5] == itemCondition
                                ) {
                                  const existingEntry = dataInnovative.find((entry) => entry.ID === columns[4]);
                                  let startamount = parseFloat(columns[8])
                                  let endamount = parseFloat(columns[9])
                                  let amountSpent = startamount - endamount;
                                  if (existingEntry) {
                                    existingEntry.spending += amountSpent;
                                  } else {
                                    dataInnovative.push({
                                      ID: columns[4],
                                      spending: amountSpent,
                                    });
                                  }
                                }
                              });
                        var startAngle = k.startAngle * (180 / Math.PI);
                        var endAngle = k.endAngle * (180 / Math.PI);
                        var startAngleInDegrees = startAngle - 90;
                        var endAngleInDegrees = endAngle - 90;
                
                        
                        var startAngleInRadians = degreesToRadians(startAngleInDegrees);
                        var endAngleInRadians = degreesToRadians(endAngleInDegrees);
                
                        
                        var startX = Math.cos(startAngleInRadians) * length_of_line;
                        var startY = Math.sin(startAngleInRadians) * length_of_line;
                        var endX = Math.cos(endAngleInRadians) * length_of_line;
                        var endY = Math.sin(endAngleInRadians) * length_of_line;
                
                        
                        var numLines = dataInnovative.length;
                        for (var i = 1; i <= numLines; i++) {
                            var currentAngle = startAngleInRadians + (i / (numLines + 1)) * (endAngleInRadians - startAngleInRadians);
                            var currentStartX = Math.cos(currentAngle) * radius;
                            var currentStartY = Math.sin(currentAngle) * radius;
                            var currentX = Math.cos(currentAngle) * length_of_line;
                            var currentY = Math.sin(currentAngle) * length_of_line;
                
                            svg.append("line")
                                .attr("x1", currentStartX)
                                .attr("y1", currentStartY)
                                .attr("x2", currentX)
                                .attr("y2", currentY)
                                .attr("class", function(){
                                    if(itemCondition == "Eating"){
                                        return "Restaurant_ID: " + dataInnovative[i-1].ID + "/Spent: " + dataInnovative[i-1].spending;
                                    }
                                    else{
                                        return "Pub_ID: " + dataInnovative[i-1].ID + "/Spent: " + dataInnovative[i-1].spending;
                                    }
                                })
                                .attr("stroke-width", 3)
                                .attr("stroke", `${colors[k.index]}`)
                                .on("mouseover", function () {
                                    var hoveredData = d3.select(this).attr("class").split("/");
                                    // svg.append("text")
                                    //     .attr("x","5")
                                    //     .attr("y","6")
                                    //     .attr("class", "innovativeText")
                                    //     .attr("text-anchor", "middle")
                                    //     .attr("fill", "black")
                                    //     .attr("font-size", "12px")
                                    //     .text(function () {
                                    //         return hoveredData[0];})
                                    svg.append("text")
                                        .attr("x","5")
                                        .attr("y","8")
                                        .attr("class","innovativeText")
                                        .attr("text-anchor", "middle")
                                        .attr("fill", "black")
                                        .attr("font-size", "12px")
                                        .text(function () {
                                            return hoveredData[0];})
                                    d3.select(this)
                                        .transition()
                                        .duration(200)
                                        .attr("stroke-width",5)
                                })
                                .on("mouseout", function () {
                                    d3.select(".innovativeText").remove()
                                    d3.select(this)
                                        .transition()
                                        .duration(200)
                                        .attr("stroke-width",3)
                                })
                        }});
                        function degreesToRadians(degrees) {
                            return degrees * (Math.PI / 180);
                        }
                        arcs.append("path")
                        .attr("d", arc)
                        .attr("fill", function(d, i) {
                            return colors[i];
                        });
}