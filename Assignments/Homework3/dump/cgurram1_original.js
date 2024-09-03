let countries_regions = []
let global_development = []
const TotalCountries_Regions = new Map();
const array_allCountries = []
const array_allRegions = []
let allRegions_array = [];
const x_axis_attributes = ["Data.Health.Birth Rate","Data.Health.Death Rate","Data.Health.Fertility Rate",
                            "Data.Health.Life Expectancy at Birth, Female","Data.Health.Life Expectancy at Birth, Male",
                            "Data.Health.Life Expectancy at Birth, Total","Data.Infrastructure.Telephone Lines per 100 People",
                            "Data.Rural Development.Agricultural Land Percent","Data.Rural Development.Arable Land Percent",
                            "Data.Rural Development.Rural Population Growth"]
colors = new Map()
colors.set("North America", "rgba(34, 67, 17, 1)");
colors.set("Sub-Saharan Africa", "rgba(32,120,175,255)");
colors.set("East Asia & Pacific", "rgba(253,128,12,255)");
colors.set("South Asia", "rgba(43,160,45,255)");
colors.set("Latin America & Caribbean", "rgba(213,40,40,255)");
colors.set("Middle East & North Africa", "rgba(147,102,192,255)");
colors.set("Europe & Central Asia", "rgba(141,85,74,255)");
let my_selectedRegions = [];
let my_selectedCountries = [];
let selectedAttr_X = "";
let selectedAttr_Circle = "";
let selectedYear = 1998;
document.addEventListener('DOMContentLoaded', async function () {
    await d3.csv('../data/countries_regions.csv')
        .then(function (data1) {
            countries_regions = data1;
        })
    await d3.csv('../data/global_development.csv')
    .then(function (data2) {
        global_development = data2;
        for (let i = 0; i < global_development.length; i++) {
            for (let j = 0; j < countries_regions.length; j++) {
                if (global_development[i]["Country"] == countries_regions[j]["name"]) {
                    TotalCountries_Regions.set(countries_regions[j]["name"], countries_regions[j]["World_bank_region"]);
                    if(array_allCountries.includes(countries_regions[j]["name"]) == false){
                        array_allCountries.push(countries_regions[j]["name"]);
                    }
                    if(array_allRegions.includes(countries_regions[j]["World_bank_region"]) == false){
                        array_allRegions.push(countries_regions[j]["World_bank_region"]);
                    }
                    
                }
            }
        }
    })
    // Regions 
    {   
        allRegions_array = array_allRegions
        const allRegionsList = d3.select(".allRegionsList");
        allRegionsList.selectAll("div")
            .data(allRegions_array)
            .enter()
            .append("div")
            .attr("style","display:flex")
            .attr("class", function(d,i){
                return "Region" + i
            })
            .on("click",function(d,i){
                let curr_check = d3.select(`.checkbox${allRegions_array.indexOf(i)}-check`)
                let curr_uncheck = d3.select(`.checkbox${allRegions_array.indexOf(i)}`)
                let classAttributeCheck = curr_check.attr("class");
                let classAttributeUnCheck = curr_uncheck.attr("class");
                if(classAttributeCheck.includes("hidden") == false){
                    classAttributeCheck+=" hidden"
                    curr_check.attr("class",classAttributeCheck)
                    curr_uncheck.attr("class",classAttributeUnCheck.slice(0,-7))
                    index = my_selectedRegions.indexOf(i)
                    my_selectedRegions.splice(index,1);
                    TotalCountries_Regions.forEach((value, key) => {
                        if(value == i){
                            let ind = my_selectedCountries.indexOf(key)
                            my_selectedCountries.splice(index,1) 
                        }
                    });
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                else{
                    classAttributeUnCheck+=" hidden"
                    curr_uncheck.attr("class",classAttributeUnCheck)
                    curr_check.attr("class",classAttributeCheck.slice(0,-7))
                    if(my_selectedRegions.includes(i) == false){
                        my_selectedRegions.push(i);
                    }
                    
                    TotalCountries_Regions.forEach((value, key) => {
                        if(value == i){
                            if(my_selectedCountries.includes(key) == false){
                                my_selectedCountries.push(key); 
                            }
                             
                        }
                    });
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                if(my_selectedRegions.length == array_allRegions.length && d3.select(".selectAllLable").text() == "Select All"){
                    d3.select(".selectAll_regions").node().click();
                }
                else if(my_selectedRegions.length > 0){
                    d3.select(".regions_lable").text(my_selectedRegions.length + " selected")
                }
                else{
                    d3.select(".regions_lable").text("Select Region")
                }
            })
            .each(function(d, i) {
                d3.select(this)
                    .append("div")
                    .attr("class", "selectAllCheckbox")
                    .each(function(d,i){
                        d3.select(this)
                            .append("i")
                            .attr("class",`fas fa-square-check region_checkbox-check checkbox${allRegions_array.indexOf(d)}-check R-CHECKBOX-CHECK hidden`)
                        d3.select(this)
                            .append("i")
                            .attr("class",`fas fa-square region_checkbox R-CHECKBOX checkbox${allRegions_array.indexOf(d)}`)
                    })
                d3.select(this)
                    .append("div")
                    .text(function(d) {
                        return d;
                    });
            

            });
            d3.select(".dropdown_region_top")
                .on("click", function(){
                    d3.select(".down-arrow").classed("hidden", function(d) {
                        return !d3.select(this).classed("hidden");
                    });
                    d3.select(".up-arrow").classed("hidden", function(d) {
                        return !d3.select(this).classed("hidden");
                    });
                    d3.select(".dropdown_region_bottom")
                        .attr("style", function(){
                            dropdown_list_region = d3.select(".dropdown_region_bottom")
                            if(dropdown_list_region.style("display") == "block"){
                                return "display:none"
                            }
                            else{
                                return "display:block"
                            }
                        })
                    d3.select(".dropdown_country_bottom")
                        .attr("style", "display:none")
                    d3.select(".dropdown_x_axis_bottom")
                        .attr("style", "display:none")
                    d3.select(".dropdown_circle_size_bottom")
                        .attr("style","display:none")
                    
                })
                d3.select(".selectAll_regions")
                    .on("click",function(){
                        curr_total_check = d3.select(`.total-check`)
                        curr_total_uncheck = d3.select(`.total`)
                        classAttributeTotalCheck = curr_total_check.attr("class");
                        classAttributeTotalUnCheck = curr_total_uncheck.attr("class");
                        if(classAttributeTotalCheck.includes("hidden") == false){
                            d3.select(".selectAllLable").text("Select All")
                            classAttributeTotalCheck+=" hidden"
                            curr_total_check.attr("class",classAttributeTotalCheck)
                            curr_total_uncheck.attr("class",classAttributeTotalUnCheck.slice(0,-7))
                            d3.selectAll(".R-CHECKBOX-CHECK").classed("hidden", true);
                            d3.selectAll(".R-CHECKBOX").classed("hidden", false);
                            my_selectedRegions = [];
                            my_selectedCountries = [];
                            if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                        }
                        else{
                            d3.select(".selectAllLable").text("Deselect All")
                            classAttributeTotalUnCheck+=" hidden"
                            curr_total_uncheck.attr("class",classAttributeTotalUnCheck)
                            curr_total_check.attr("class",classAttributeTotalCheck.slice(0,-7))
                            d3.selectAll(".R-CHECKBOX-CHECK").classed("hidden", false);
                            d3.selectAll(".R-CHECKBOX").classed("hidden", true);
                            my_selectedRegions = [...array_allRegions];
                            my_selectedCountries =[...array_allCountries];
                            if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                        }
                        if(my_selectedRegions.length > 0){
                            d3.select(".regions_lable").text(my_selectedRegions.length + " selected")
                        }
                        else{
                            d3.select(".regions_lable").text("Select Region")
                        }
                    })
    }
    // Countries
    {
        const allCountriesList = d3.select(".allCountriesList")
        var allCountries_array = array_allCountries
        allCountriesList.selectAll("div")
            .data(array_allCountries)
            .enter()
            .append("div")
            .attr("style","display:flex")
            .attr("class",function(d,i){
                return "Country" + i
            })
            .on("click",function(d,i){
                curr_check_country = d3.select(`.checkbox${allCountries_array.indexOf(i)}-check-country`)
                curr_uncheck_country = d3.select(`.checkbox${allCountries_array.indexOf(i)}-country`)
                classAttributeCheck_country = curr_check_country.attr("class");
                classAttributeUnCheck_country = curr_uncheck_country.attr("class");
                if(classAttributeCheck_country.includes("hidden") == false){
                    classAttributeCheck_country+=" hidden"
                    curr_check_country.attr("class",classAttributeCheck_country)
                    curr_uncheck_country.attr("class",classAttributeUnCheck_country.slice(0,-7))
                    let inde = my_selectedCountries.indexOf(i)
                    console.log(my_selectedCountries)
                    my_selectedCountries.splice(inde,1);
                    console.log(my_selectedCountries)
                    let deleteFlag = true;
                    let cur_reg = TotalCountries_Regions.get(i)
                    for(let j = 0;j<my_selectedCountries.length;j++){
                        if(my_selectedCountries[j] != i && TotalCountries_Regions.get(my_selectedCountries[j]) == cur_reg){
                            deleteFlag = false;
                        }
                    }
                    if(deleteFlag == true){
                        let new_index = my_selectedRegions.indexOf(TotalCountries_Regions.get(i))
                        my_selectedRegions.splice(new_index,1)
                    }
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                else{
                    classAttributeUnCheck_country+=" hidden"
                    curr_uncheck_country.attr("class",classAttributeUnCheck_country)
                    curr_check_country.attr("class",classAttributeCheck_country.slice(0,-7))
                    if(my_selectedCountries.includes(i) == false){
                        my_selectedCountries.push(i);
                    }
                    
                    if(my_selectedRegions.includes(TotalCountries_Regions.get(i)) == false){
                        my_selectedRegions.push(TotalCountries_Regions.get(i))
                    }
                    
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                if(my_selectedCountries.length == allCountries_array.length && d3.select(".selectAllLable_country").text() == "Select All"){
                    d3.select(".selectAll_countries").node().click();
                }
                if(my_selectedCountries.length > 0){
                    d3.select(".country_lable").text(my_selectedCountries.length + " selected")
                }
                else{
                    d3.select(".country_lable").text("Select Country")
                }
            })
            .each(function(d,i){
                d3.select(this)
                    .append("div")
                    .attr("class","selectAllCheckbox_country")
                    .each(function(d,i){
                        d3.select(this)
                            .append("i")
                            .attr("class",`fas fa-square-check country_checkbox-check checkbox${allCountries_array.indexOf(d)}-check-country R-CHECKBOX-CHECK-country hidden`)
                        d3.select(this)
                            .append("i")
                            .attr("class",`fas fa-square country_checkbox R-CHECKBOX-country checkbox${allCountries_array.indexOf(d)}-country`)
                    })
                d3.select(this)
                    .append("div")
                    .text(function(d){
                        return d
                    })
            })
        
        d3.select(".dropdown_country_top")
            .on("click", function(){
                d3.select(".down-arrow2").classed("hidden", function(d) {
                    return !d3.select(this).classed("hidden");
                });
                d3.select(".up-arrow2").classed("hidden", function(d) {
                    return !d3.select(this).classed("hidden");
                });
                d3.select(".dropdown_country_bottom")
                    .attr("style", function(){
                        dropdown_list_country = d3.select(".dropdown_country_bottom")
                        if(dropdown_list_country.style("display") == "block"){
                            return "display:none"
                        }
                        else{
                            return "display:block"
                        }
                    })
                d3.select(".dropdown_region_bottom")
                    .attr("style","display:none")
                d3.select(".dropdown_x_axis_bottom")
                    .attr("style", "display:none")
                d3.select(".dropdown_circle_size_bottom")
                    .attr("style","display:none")
            })
        
        d3.select(".selectAll_countries")
            .on("click",function(){
                curr_total_check_country = d3.select(`.total-check_country`)
                curr_total_uncheck_country = d3.select(`.total_country`)
                classAttributeTotalCheck_country = curr_total_check_country.attr("class");
                classAttributeTotalUnCheck_country = curr_total_uncheck_country.attr("class");
                if(classAttributeTotalCheck_country.includes("hidden") == false){
                    d3.select(".selectAllLable_country").text("Select All")
                    classAttributeTotalCheck_country+=" hidden"
                    curr_total_check_country.attr("class",classAttributeTotalCheck_country)
                    curr_total_uncheck_country.attr("class",classAttributeTotalUnCheck_country.slice(0,-7))
                    d3.selectAll(".R-CHECKBOX-CHECK-country").classed("hidden", true);
                    d3.selectAll(".R-CHECKBOX-country").classed("hidden", false);
                    my_selectedCountries = [];
                    my_selectedRegions = [];
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                }
                else{
                    d3.select(".selectAllLable_country").text("Deselect All")
                    classAttributeTotalUnCheck_country+=" hidden"
                    curr_total_uncheck_country.attr("class",classAttributeTotalUnCheck_country)
                    curr_total_check_country.attr("class",classAttributeTotalCheck_country.slice(0,-7))
                    d3.selectAll(".R-CHECKBOX-CHECK-country").classed("hidden", false);
                    d3.selectAll(".R-CHECKBOX-country").classed("hidden", true);
                    my_selectedCountries = [...allCountries_array];
                    for(let i = 0;i<allRegions_array.length;i++){
                        if(my_selectedRegions.includes() == false){
                            my_selectedRegions.push(allRegions_array[i])
                        }
                    }
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                }
                if(my_selectedCountries.length > 0){
                    d3.select(".country_lable").text(my_selectedCountries.length + " selected")
                }
                else{
                    d3.select(".country_lable").text("Select Country")
                }
            })
    }
    // console.log(allCountries_array)
    // X Axis Attribute
    {
        const allAttributesList = d3.select(".dropdown_x_axis_bottom")
        allAttributesList.selectAll("div")
            .data(x_axis_attributes)
            .enter()
            .append("div")
                // .attr("style","cursor:pointer")
                .style("cursor","pointer")
                .style("margin","5px")
                .style("padding-left", "5px")
                .text(function(d,i){
                    return d.split(".")[2];
                })
                .on("mouseover", function(){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("font-weight", "bold")
                })
                .on("mouseout",function(){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("font-weight", "normal")
                })
                .on("click",function(d,i){
                    d3.select(".x_axis_lable").text(i.split(".")[2])
                    selectedAttr_X = i
                    allAttributesList.style("display","none")
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                })
        d3.select(".dropdown_x_axis_top")
                .on("click", function(){
                    if(allAttributesList.style("display") == "none"){
                        allAttributesList.style("display","block")
                    }
                    else{
                        allAttributesList.style("display","none")
                    }
                    d3.select(".dropdown_region_bottom")
                        .attr("style","display:none")
                    d3.select(".dropdown_country_bottom")
                        .attr("style", "display:none")
                    d3.select(".dropdown_circle_size_bottom")
                        .attr("style","display:none")
                })

    }
    // Circle Size Attribute
    {
        const allAttributesListCircle = d3.select(".dropdown_circle_size_bottom")
        let circle_size_attributes = x_axis_attributes.filter(item => item !== selectedAttr_X);
        allAttributesListCircle.selectAll("div")
            .data(circle_size_attributes)
            .enter()
            .append("div")
                .style("cursor","pointer")
                .style("margin","5px")
                .style("padding-left", "5px")
                .text(function(d,i){
                    return d.split(".")[2];
                })
                .on("mouseover", function(){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("font-weight", "bold")

                })
                .on("mouseout",function(){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("font-weight", "normal")
                })
                .on("click",function(d,i){
                    d3.select(".circle_size_lable").text(i.split(".")[2])
                    selectedAttr_Circle = i
                    allAttributesListCircle.style("display","none")
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                })
        d3.select(".dropdown_circle_size_top")
                .on("click", function(){
                    if(allAttributesListCircle.style("display") == "none"){
                        allAttributesListCircle.style("display","block")
                    }
                    else{
                        allAttributesListCircle.style("display","none")
                    }
                    d3.select(".dropdown_region_bottom")
                        .attr("style","display:none")
                    d3.select(".dropdown_country_bottom")
                        .attr("style", "display:none")
                    d3.select(".dropdown_x_axis_bottom")
                        .attr("style", "display:none")
                })
    }
    // year
    {
        d3.select(".left")
            .on("click",function(){
                if(selectedYear > 1980){
                    selectedYear = selectedYear - 1
                    d3.select(".year_number").text(selectedYear)
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                }
                else{
                    d3.select(this)
                        .style("cursor", "not-allowed");
                }
            })
            .on("mouseover",function(){
                if(selectedYear > 1980){
                    d3.select(this)
                        .style("cursor", "pointer");
                }
                else{
                    d3.select(this)
                        .style("cursor", "not-allowed");
                }
                
            })
        d3.select(".right")
            .on("click",function(){
                if(selectedYear < 2013){
                    selectedYear = selectedYear + 1
                    d3.select(".year_number").text(selectedYear)
                    if(my_selectedRegions.length > 0 && my_selectedCountries.length > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                }
                else{
                    d3.select(this)
                        .style("cursor", "not-allowed");
                }
            })
            .on("mouseover",function(){
                if(selectedYear < 2013){
                    d3.select(this)
                        .style("cursor", "pointer");
                }
                else{
                    d3.select(this)
                        .style("cursor", "not-allowed");
                }
            })
    }   
    // hover
    {
        d3.selectAll(".hoverClass")
            .on("mouseover", function(){
                curr = d3.select(this)
                    .style("background-color", "rgba(94, 68, 161, 255)")
                    .style("color", "white")
                    .style("box-shadow", "0 0 30px rgba(94, 68, 161, 0.5)")
                    .style("cursor", "pointer");
                curr.select(".attr_lable")
                    .attr("style", "color:white")
            })
            .on("mouseout", function(){
                curr = d3.select(this)
                    .attr("style", "background-color: white")
                curr.select(".attr_lable")
                    .attr("style", "color:rgba(94,68,161,255)")
            })
    }
    // PLAY
    {
        const pauseIcon = d3.select(".fa-pause");
        const playIcon = d3.select(".fa-play");
        let intervalId; // Variable to store the interval ID
        let isPlaying = false;
        function clickNext() {
            d3.select(".right").node().click();
        }
        d3.select(".playButton").on("click", function() {
            const isPaused = pauseIcon.style("display") === "inline-flex";
            if (isPaused) {
                pauseIcon.style("display", "none");
                playIcon.style("display", "inline-flex");
                if (isPlaying) {
                    clearInterval(intervalId);
                    isPlaying = false;
                }
            } else {
                pauseIcon.style("display", "inline-flex");
                playIcon.style("display", "none");
                if (!isPlaying) {
                    intervalId = setInterval(clickNext, 1000);
                    isPlaying = true;
                }
            }
            
        });
        d3.select(".StopButton")
            .on("click", function(){
                pauseIcon.style("display", "none");
                playIcon.style("display", "inline-flex");
                clearInterval(intervalId);
                isPlaying = false;
            })
        
    } 
    });

function fun(my_selectedRegions,selected_Countries,selectedAttr_X,selectedAttr_Circle,selectedYear){
    let data = []
    for(let i = 0;i<global_development.length;i++){
        if(my_selectedCountries.includes(global_development[i]["Country"]) && selectedYear == global_development[i]["Year"])
        data.push([global_development[i]["Country"],TotalCountries_Regions.get(global_development[i]["Country"]),global_development[i][selectedAttr_X],global_development[i][selectedAttr_Circle]])
    }
    drawBeeswarm(data)
}
function reduceCircleSizesScale(inputArray, outputMin, outputMax) {
    if(inputArray.length == 1){
        return [5]
    }
    const inputMin = Math.min(...inputArray);
    const inputMax = Math.max(...inputArray);
    const scale = (value) => {
        return ((outputMax - outputMin) * (value - inputMin)) / (inputMax - inputMin) + outputMin;
    };
    const scaledArray = inputArray.map(scale);

    return scaledArray;
}
function scaleValuesToRange(values, targetMax) {
    const max = Math.max(...values);
  
    return values.map(value => {
      const scaledValue = (value/max) * targetMax;
      return scaledValue;
    });
  }
  function scaleValuesToRange_SQRT(values, targetMax) {
    return values.map(value => {
      const scaledValue = Math.sqrt(value);
      return scaledValue;
    });
  }


let data;
function drawBeeswarm(data){
    // console.log(data)
    data = data.map(function(d) {
        console.log(d)
        return [d[0], d[1], parseFloat(d[2]), parseFloat(d[3]),parseFloat(d[4])];
    });
    // console.log(data)
    let circle_sizes = []
    for(let i = 0;i<data.length;i++){
        circle_sizes.push(data[i][3])
    }
    circle_exception_list = ["Data.Health.Life Expectancy at Birth, Female", "Data.Health.Life Expectancy at Birth, Male","Data.Health.Life Expectancy at Birth, Total","Data.Infrastructure.Telephone Lines per 100 People"]
    if(circle_exception_list.includes(selectedAttr_Circle)){
        scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 15);
    }
    else if(selectedAttr_Circle == "Data.Rural Development.Agricultural Land Percent"){
        scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 20);
    }
    else if(selectedAttr_Circle == "Data.Rural Development.Rural Population Growth"){
        scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 40);
    }
    else{
        scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 30);
    }
    let SVG = d3.select("#ScatterPlot")
    // d3.selectAll(".scatterPlotGroup").remove()
    d3.select(".x-axis").remove()
    d3.select(".y-axis").remove()
    d3.select(".x-axis-label").remove()
    let allCountries_array = array_allCountries
    // console.log(allCountries_array)
    for(let i = 0;i<allCountries_array.length;i++){
        if(my_selectedCountries.includes(allCountries_array[i]) == false){
            d3.select(".circle" + i).remove()
        }
    }
    g = d3.select(".scatterPlotGroup")
    const paddingPercentage = 10;
    const rangeWidth = d3.max(data, function(d) { return d[2]; }) - d3.min(data, function(d) { return d[2]; });
    let padding = (rangeWidth * paddingPercentage) / 100;
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d[2]; }) - padding,d3.max(data, function(d) { return d[2]; }) + padding])
        .range([100,1150]);
    const yScale = d3.scaleBand()
        .domain(Array.from(data.map(function(d) { return d[1]; }))) 
        .range([20, 700]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, 700)")
        .call(xAxis);
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .attr("transform", "translate(100, 0)");
    g.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", 625)
        .attr("y", 750)
        .text(()=>{
            if(selectedAttr_X != ""){
                return selectedAttr_X.split(".")[2]
            }
            else{
                return ""
            }
            
        });
    let circles = g.selectAll(".circl")
        .data(data, function(d,i) {
            return i; // Use a unique identifier here
        })
        // .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d,i){
            // return "circl"
            return "circl circle" + allCountries_array.indexOf(d[0])
        })
        .attr("stroke", "black")
        .attr("cx", (d) => {
                return xScale(d[2])
        })
        .attr("cy", d => {
            if(my_selectedRegions.length == 1){
                return yScale(d[1]) + 690/2;
            }
            else if(my_selectedRegions.length == 2){
                return yScale(d[1]) + 690/3 - 54;
            }
            else if(my_selectedRegions.length == 3){
                return yScale(d[1]) + 690/4 - 54;
            }
            else if(my_selectedRegions.length == 4){
                return yScale(d[1]) + 690/5 - 50;
            }
            else if(my_selectedRegions.length == 5){
                return yScale(d[1]) + 690/6 - 43;
            }
            else if(my_selectedRegions.length == 6){
                return yScale(d[1]) + 690/7 - 38;
            }
            else{
                return yScale(d[1]) + 690/8 - 34;
            }
        })
        .attr("r", function(d,i){
                return scaled_circle_sizes[i]
        })
        .style("fill", function(d,i){
            return colors.get(d[1])
        });
    // let exitCircles = circles.exit();

    // // Remove the unwanted circles
    // exitCircles.remove();
    let simulation = d3.forceSimulation(data)
        .force("x", d3.forceX((d) => {
            return xScale(d[2]);
            }).strength(0.2))
        
        .force("y", d3.forceY((d) => {
            if(my_selectedRegions.length == 1){
                return yScale(d[1]) + 690/2;
            }
            else if(my_selectedRegions.length == 2){
                return yScale(d[1]) + 690/3 - 54;
            }
            else if(my_selectedRegions.length == 3){
                return yScale(d[1]) + 690/4 - 54;
            }
            else if(my_selectedRegions.length == 4){
                return yScale(d[1]) + 690/5 - 50;
            }
            else if(my_selectedRegions.length == 5){
                return yScale(d[1]) + 690/6 - 43;
            }
            else if(my_selectedRegions.length == 6){
                return yScale(d[1]) + 690/7 - 38;
            }
            else{
                return yScale(d[1]) + 690/8 - 34;
            }
            }).strength(1))
        
        .force("collide", d3.forceCollide((d,i) => {
            return scaled_circle_sizes[i];
            }))
        
        .alphaDecay(0)
        .alpha(0.3)
        .on("tick", tick);
    function tick() {
        const circles = d3.selectAll(".circl")
        circles.transition()
            .duration(500) // Set the duration of the transition in milliseconds
            .ease(d3.easeLinear)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);
        }
    let init_decay = setTimeout(function () {
        console.log("start alpha decay");
        simulation.alphaDecay(0.1);
        }, 3000);
}


