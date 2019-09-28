var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 50,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./assets/data/data.csv").then(function (healthdata, error) { 
  if (error) throw error;
  console.log(healthdata);

  healthdata.forEach(function (data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    });

  var xScale = d3.scaleLinear()
    .domain(d3.extent(healthdata, d => d.poverty))
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain(d3.extent(healthdata, d => d.healthcare))
    .range([height, 0]);

  var line = d3.line()
    .x(data => xScale(data.poverty))
    .y(data => yScale(data.healthcare));

  chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "pink")
    .attr("opacity", ".75");

    chartGroup.selectAll("text")
    .data(healthdata)
    .enter()
    .append("text")
    .text( d => d.abbr)
    .attr("x", d => xScale(d.poverty)-10)
    .attr("y", d => yScale(d.healthcare)+5)
    .attr("fill", "blue");

    var xaxis = d3.axisBottom(xScale);
    var yaxis = d3.axisLeft(yScale);
  
    chartGroup.append("g")
      .call(yaxis);
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xaxis);

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .classed("active", true)
    .text("Lacks of Healthcare(%)");

    chartGroup.append("text")
    .attr("x", (width / 2))
    .attr("y", height+ 40)
    .classed("active", true)
    .text("In Poverty(%)");

});



