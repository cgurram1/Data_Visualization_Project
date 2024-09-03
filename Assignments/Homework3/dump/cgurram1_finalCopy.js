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
let my_selectedRegions = new Map();
let my_selectedCountries = new Map();
let selectedAttr_X = "";
let selectedAttr_Circle = "";
let selectedYear = 1998;
let entireData = []
for(let i = 0;i<=(2013-1960);i++){
    entireData.push(new Map())
}
function my_length(input_map){
    let count = 0
    for (const [key, val] of input_map.entries()) {
        if (val === 1) {
            count++;
        }
    }
    return count
}
function setAllValuesToZero(input_map) {
    // Iterate over the Map's keys and set their values to 0
    for (const key of input_map.keys()) {
        input_map.set(key, 0);
    }

    return input_map;
}
function setAllValuesToOne(input_map) {
    // Iterate over the Map's keys and set their values to 0
    for (const key of input_map.keys()) {
        input_map.set(key, 1);
    }

    return input_map;
}
document.addEventListener('DOMContentLoaded', async function () {
    await d3.csv('../data/countries_regions.csv')
        .then(function (data1) {
            countries_regions = data1;
        })
    await d3.csv('../data/global_development.csv')
    .then(function (data2) {
        global_development = data2;
        for (let i = 0; i < global_development.length; i++) {
            entireData[parseInt(global_development[i]["Year"]) - 1960].set(global_development[i]["Country"], new Map([
                [x_axis_attributes[0], parseFloat(global_development[i][x_axis_attributes[0]])],
                [x_axis_attributes[1], parseFloat(global_development[i][x_axis_attributes[1]])],
                [x_axis_attributes[2], parseFloat(global_development[i][x_axis_attributes[2]])],
                [x_axis_attributes[3], parseFloat(global_development[i][x_axis_attributes[3]])],
                [x_axis_attributes[4], parseFloat(global_development[i][x_axis_attributes[4]])],
                [x_axis_attributes[5], parseFloat(global_development[i][x_axis_attributes[5]])],
                [x_axis_attributes[6], parseFloat(global_development[i][x_axis_attributes[6]])],
                [x_axis_attributes[7], parseFloat(global_development[i][x_axis_attributes[7]])],
                [x_axis_attributes[8], parseFloat(global_development[i][x_axis_attributes[8]])],
                [x_axis_attributes[9], parseFloat(global_development[i][x_axis_attributes[9]])]
            ]));
            for (let j = 0; j < countries_regions.length; j++) {
                if (global_development[i]["Country"] == countries_regions[j]["name"]) {
                    TotalCountries_Regions.set(countries_regions[j]["name"], countries_regions[j]["World_bank_region"]);
                    my_selectedCountries.set(countries_regions[j]["name"],0)
                    my_selectedRegions.set(countries_regions[j]["World_bank_region"],0)
                }
            }
        }
    })
    
    // Regions 
    {   
        allRegions_array = Array.from(my_selectedRegions.keys());
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
                    // index = my_selectedRegions.indexOf(i)
                    // my_selectedRegions.splice(index,1);
                    my_selectedRegions.set(i,0)
                    TotalCountries_Regions.forEach((value, key) => {
                        if(value == i){
                            // let ind = my_selectedCountries.indexOf(key)
                            // my_selectedCountries.splice(index,1)
                            my_selectedCountries.set(key,0)
                            index = Array.from(my_selectedCountries.keys()).indexOf(key)
                            curr_check_country = d3.select(`.checkbox${index}-check-country`)
                            classAttributeCheck_country = curr_check_country.attr("class");
                            if(classAttributeCheck_country.includes("hidden") == false){
                                curr_check_country.node().click()
                            }
                            
                        }
                    });
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                else{
                    classAttributeUnCheck+=" hidden"
                    curr_uncheck.attr("class",classAttributeUnCheck)
                    curr_check.attr("class",classAttributeCheck.slice(0,-7))
                    my_selectedRegions.set(i,1)
                    // if(my_selectedRegions.includes(i) == false){
                    //     my_selectedRegions.push(i);
                    // }
                    
                    TotalCountries_Regions.forEach((value, key) => {
                        if(value == i){
                            my_selectedCountries.set(key,1)
                            index = Array.from(my_selectedCountries.keys()).indexOf(key)
                            curr_check_country = d3.select(`.checkbox${index}-check-country`)
                            classAttributeCheck_country = curr_check_country.attr("class");
                            if(classAttributeCheck_country.includes("hidden") == true){
                                curr_check_country.node().click()
                            }
                             
                        }
                    });
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                if(my_length(my_selectedRegions) == 7 && d3.select(".selectAllLable").text() == "Select All"){
                    d3.select(".selectAll_regions").node().click();
                }
                else if(my_length(my_selectedRegions) > 0){
                    d3.select(".regions_lable").text(my_length(my_selectedRegions) + " selected")
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
                            my_selectedRegions = setAllValuesToZero(my_selectedRegions);
                            my_selectedCountries = setAllValuesToZero(my_selectedCountries);
                            TotalCountries_Regions.forEach((value, key) => {
                                index = Array.from(my_selectedCountries.keys()).indexOf(key)
                                curr_check_country = d3.select(`.checkbox${index}-check-country`)
                                classAttributeCheck_country = curr_check_country.attr("class");
                                if(classAttributeCheck_country.includes("hidden") == false){
                                    curr_check_country.node().click()
                                }
                            });
                            if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                            my_selectedRegions = setAllValuesToOne(my_selectedRegions)
                            my_selectedCountries = setAllValuesToOne(my_selectedCountries)
                            TotalCountries_Regions.forEach((value, key) => {
                                index = Array.from(my_selectedCountries.keys()).indexOf(key)
                                curr_check_country = d3.select(`.checkbox${index}-check-country`)
                                classAttributeCheck_country = curr_check_country.attr("class");
                                if(classAttributeCheck_country.includes("hidden") == true){
                                    curr_check_country.node().click()
                                }
                            });
                            if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                        }
                        if(my_length(my_selectedRegions) > 0){
                            d3.select(".regions_lable").text(my_length(my_selectedRegions) + " selected")
                        }
                        else{
                            d3.select(".regions_lable").text("Select Region")
                        }
                    })
    }
    // Countries
    {
        const allCountriesList = d3.select(".allCountriesList")
        var allCountries_array = Array.from(my_selectedCountries.keys())
        allCountriesList.selectAll("div")
            .data(allCountries_array)
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
                    my_selectedCountries.set(i,0)
                    let deleteFlag = true;
                    let cur_reg = TotalCountries_Regions.get(i)
                    for (const [key, value] of my_selectedCountries) {
                        if(value == 1 && TotalCountries_Regions.get(key) == cur_reg){
                            deleteFlag = false;
                            break
                        }
                    }
                    if(deleteFlag == true){
                        my_selectedRegions.set(TotalCountries_Regions.get(i),0)
                        // index = Array.from(my_selectedRegions.keys()).indexOf(TotalCountries_Regions.get(i))
                        // regionDiv = d3.select(".Regions" + index)
                        // if(regionDiv.select(".fa-square-check").attr("class").includes("hidden") == false){
                        //     regionDiv.node().click()
                        // }
                    }
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                else{
                    classAttributeUnCheck_country+=" hidden"
                    curr_uncheck_country.attr("class",classAttributeUnCheck_country)
                    curr_check_country.attr("class",classAttributeCheck_country.slice(0,-7))
                    my_selectedCountries.set(i,1)
                    my_selectedRegions.set(TotalCountries_Regions.get(i),1)
                    // let addFlag = false;
                    // let cur_reg = TotalCountries_Regions.get(i)
                    // for (const [key, value] of my_selectedCountries) {
                    //     if(value == 1 && TotalCountries_Regions.get(key) == cur_reg){
                    //         deleteFlag = false;
                    //         break
                    //     }
                    // }
                    // if(deleteFlag == true){}
                    // index = Array.from(my_selectedRegions.keys()).indexOf(TotalCountries_Regions.get(i))
                    // let curr_check = d3.select(`.checkbox${index}-check`)
                    // let classAttributeCheck = curr_check.attr("class");
                    // if(classAttributeCheck.includes("hidden") == true){
                    //     curr_check.node().click()
                    // }
                    
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                }
                if(my_length(my_selectedCountries) == allCountries_array.length && d3.select(".selectAllLable_country").text() == "Select All"){
                    d3.select(".selectAll_countries").node().click();
                }
                if(my_length(my_selectedCountries) > 0){
                    d3.select(".country_lable").text(my_length(my_selectedCountries) + " selected")
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
                    my_selectedCountries = setAllValuesToZero(my_selectedCountries);
                    my_selectedRegions = setAllValuesToZero(my_selectedRegions);
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                    my_selectedCountries = setAllValuesToOne(my_selectedCountries)
                    my_selectedRegions = setAllValuesToOne(my_selectedRegions)
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
                        fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear)
                    }
                    // drawBeeswarm()
                }
                if(my_length(my_selectedCountries) > 0){
                    d3.select(".country_lable").text(my_length(my_selectedCountries) + " selected")
                }
                else{
                    d3.select(".country_lable").text("Select Country")
                }
            })
    }
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
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                    if(my_length(my_selectedRegions) > 0 && my_length(my_selectedCountries) > 0 && selectedAttr_X!= "" && selectedAttr_Circle!= ""){
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
                    intervalId = setInterval(clickNext, 2000);
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
    // tooltip
    {

    } 
    });

function fun(my_selectedRegions,my_selectedCountries,selectedAttr_X,selectedAttr_Circle,selectedYear){
    let selected_countries_data = []
    let selected_regions_data = []
    let data = []
        my_selectedCountries.forEach((value, key) => {
            if(value === 1){
                selected_countries_data.push(key)
                try{
                    data.push([
                        key,
                        TotalCountries_Regions.get(key),
                        entireData[parseInt(selectedYear) - 1960].get(key).get(selectedAttr_X),
                        entireData[parseInt(selectedYear) - 1960].get(key).get(selectedAttr_Circle),
                    ])
                }
                catch(error){
                    console.log(key + "has no " + selectedYear)
                }
                
            }
        });
    my_selectedRegions.forEach((value, key) => {
        if(value === 1){
            selected_regions_data.push(key)
        }
    });
    // console.log(selected_countries_data)
    // console.log(selected_regions_data)
    // console.log(selectedAttr_X)
    // console.log(selectedAttr_Circle)
    // console.log(selectedYear)
    // console.log(data)
    drawBeeswarm(data,data,selected_regions_data)
}

function drawBeeswarm(data,data_previous,selected_regions_data){
    let circle_sizes = []
    for(let i = 0;i<data.length;i++){
        circle_sizes.push(data[i][3])
    }
    let inputMax = Math.max(...circle_sizes)
    let inputMin = Math.min(...circle_sizes)

    circle_exception_list = ["Data.Health.Life Expectancy at Birth, Female", "Data.Health.Life Expectancy at Birth, Male","Data.Health.Life Expectancy at Birth, Total","Data.Infrastructure.Telephone Lines per 100 People"]
    
    let SVG = d3.select("#ScatterPlot")
    // d3.selectAll(".scatterPlotGroup").remove()
    d3.select(".x-axis").remove()
    d3.select(".y-axis").remove()
    d3.select(".x-axis-label").remove()
    // for (const [key, val] of my_selectedCountries.entries()) {
    //     if (val === 0) {
    //         index = Array.from(my_selectedCountries.keys()).indexOf(key)
    //         d3.select(".circle" + index).remove()
    //     }
    // }
    // g = SVG.append("g")
    //         .attr("class","scatterPlotGroup")
    g = d3.select(".scatterPlotGroup")
    const paddingPercentage = 10;
    const rangeWidth = d3.max(data, function(d) { return d[2]; }) - d3.min(data, function(d) { return d[2]; });
    let padding = (rangeWidth * paddingPercentage) / 100;
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d[2]; }) - padding,d3.max(data, function(d) { return d[2]; }) + padding])
        .range([100,1050]);
    const yScale = d3.scaleBand()
        .domain(Array.from(my_selectedRegions.keys()))
        // .domain(Array.from(data.map(function(d) { return d[1]; }))) 
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
    // Create a group (g element) for the rectangle and text
    const infoGroup = g.append("g")
        .attr("class", "info-group")
        .style("display", "none"); // Initially hide the tooltip

    // Create a rectangle
    infoGroup.append("rect")
        .attr("width", 200)
        .attr("height", 100)
        .attr("fill", "white")
        .attr("stroke", "black");

    // Add text to the rectangle
    infoGroup.append("text")
        .attr("class", "Country_tip")
        .attr("x", 10)
        .attr("y", 20)
        .text("Country: ");

    infoGroup.append("text")
        .attr("class", "Region_tip")
        .attr("x", 10)
        .attr("y", 40)
        .text("Region: ");

    infoGroup.append("text")
        .attr("class", "X_attr_tip")
        .attr("x", 10)
        .attr("y", 60)
        .text(selectedAttr_X.split(".")[2] + ": ");

    infoGroup.append("text")
        .attr("class", "CircleSize_attr_tip")
        .attr("x", 10)
        .attr("y", 80)
        .text(selectedAttr_Circle.split(".")[2] + ": ");

    infoGroup.append("text")
        .attr("class", "Year_attr_tip")
        .attr("x", 10)
        .attr("y", 100)
        .text("Year: ")
    let circles = g.selectAll(".circl")
        .data(data, (d) => d[0]);
    // circles
    //     .attr("cx", (d) => xScale(d[2]))
    //     .attr("cy", (d) => {
    //         if(my_length(my_selectedRegions) == 1){
    //             return yScale(d[1]) + 690/2;
    //         }
    //         else if(my_length(my_selectedRegions) == 2){
    //             return yScale(d[1]) + 690/3 - 54;
    //         }
    //         else if(my_length(my_selectedRegions) == 3){
    //             return yScale(d[1]) + 690/4 - 54;
    //         }
    //         else if(my_length(my_selectedRegions) == 4){
    //             return yScale(d[1]) + 690/5 - 50;
    //         }
    //         else if(my_length(my_selectedRegions) == 5){
    //             return yScale(d[1]) + 690/6 - 45;
    //         }
    //         else if(my_length(my_selectedRegions) == 6){
    //             return yScale(d[1]) + 690/7 - 38;
    //         }
    //         else{
    //             return yScale(d[1]) + 690/8 - 34;
    //         }
    //     })
    //     .attr("r", (d, i) => scaled_circle_sizes[i])
    //     .style("fill", (d, i) => colors.get(d[1]));
    circles.enter()
        .append("circle")
        .attr("class", function(d,i){
            index = Array.from(my_selectedCountries.keys()).indexOf(d[0])
            return "circl circle" + index
        })
        .attr("stroke", "black")
        .attr("cx", (d) => {
                return xScale(d[2])
        })
        .attr("cy", (d) => {
            if(d[1] == "North America"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "Sub-Saharan Africa"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "East Asia & Pacific"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "South Asia"){
                return yScale(d[1]) + 35
            }
            else if(d[1] == "Latin America & Caribbean"){
                return yScale(d[1]) + 35
            }
            else if(d[1] == "Middle East & North Africa"){
                return yScale(d[1]) + 35
            }
            else{
                return yScale(d[1]) + 35
            }
        })
        .attr("r", function(d,i){
            if(circle_sizes.length == 1){
                return 5;
            }
            else{
                if(circle_exception_list.includes(selectedAttr_Circle)){
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 15);
                    return ((15 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
                else if(selectedAttr_Circle == "Data.Rural Development.Agricultural Land Percent"){
                    return ((20 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
                else if(selectedAttr_Circle == "Data.Rural Development.Rural Population Growth"){
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 40);
                    return ((40 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
                else{
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 30);
                    return ((30 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
            }
        })
        .style("fill", function(d,i){
            return colors.get(d[1])
        })
        .on("mouseover", function (event, d) {
            const [svgx, svgy] = d3.pointer(event);

            // Update the position of the tooltip (infoGroup)
            infoGroup.style("transform", `translate(${svgx}px, ${svgy}px)`);
            infoGroup.style("display", "block");
            infoGroup.style("z-index", 100);

            // Update the text within the tooltip
            infoGroup.select(".Country_tip").text("Country: " + d[0]);
            infoGroup.select(".Region_tip").text("Region: " + d[1]);
            infoGroup.select(".X_attr_tip").text(selectedAttr_X.split(".")[2] + ": " + d[2]);
            infoGroup.select(".CircleSize_attr_tip").text(selectedAttr_Circle.split(".")[2] + ": " + d[3]);
            infoGroup.select(".Year_attr_tip").text("Year: " + selectedYear);
        })
        .on("mouseout", function () {
            // Hide the tooltip on mouseout
            infoGroup.style("display", "none");
        });

          
    circles.exit().remove();
    
    let simulation = d3.forceSimulation(data)
        .force("x", d3.forceX((d) => {
            return xScale(d[2]);
            }).strength(0.9))
        
        .force("y", d3.forceY((d) => {
            if(d[1] == "North America"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "Sub-Saharan Africa"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "East Asia & Pacific"){
                return yScale(d[1]) + 45
            }
            else if(d[1] == "South Asia"){
                return yScale(d[1]) + 35
            }
            else if(d[1] == "Latin America & Caribbean"){
                return yScale(d[1]) + 35
            }
            else if(d[1] == "Middle East & North Africa"){
                return yScale(d[1]) + 35
            }
            else{
                return yScale(d[1]) + 35
            }
            }).strength(1))
        
        .force("collide", d3.forceCollide((d,i) => {
            if(circle_sizes.length == 1){
                return 5;
            }
            else{
                if(circle_exception_list.includes(selectedAttr_Circle)){
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 15);
                    return ((15 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
                else if(selectedAttr_Circle == "Data.Rural Development.Agricultural Land Percent"){
                    return ((20 - 4) * (d[3] - inputMin)) / (inputMax - inputMin + 1) + 4
                }
                else if(selectedAttr_Circle == "Data.Rural Development.Rural Population Growth"){
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 40);
                    return ((40 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
                else{
                    // scaled_circle_sizes = reduceCircleSizesScale(circle_sizes, 4, 30);
                    return ((30 - 4) * (d[3] - inputMin)) / (inputMax - inputMin) + 4
                }
            }
        }))
        
        .alphaDecay(0)
        .alpha(0.3)
        .on("tick", tick);
    
    function tick() {
        const circles = d3.selectAll(".circl")
        circles.transition()
            .duration(100) // Set the duration of the transition in milliseconds
            .ease(d3.easeLinear)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);
        }
    let init_decay = setTimeout(function () {
        console.log("start alpha decay");
        simulation.alphaDecay(0.2);
        }, 100);
}


