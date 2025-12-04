/*
 * Scatter plot of Palmer penguins measurements
 *
 * This script reads a small subset of the Palmer penguins dataset from
 * `data/penguins.csv`, converts numeric fields to numbers, and plots
 * bill length on the x‑axis against flipper length on the y‑axis. Points
 * are colored by species. Hovering over a point shows a tooltip with
 * additional information and enlarges the circle. A legend identifies
 * the three species present in the data. The code uses D3 v7.
 */

// Set up chart dimensions and margins
const margin = { top: 20, right: 160, bottom: 50, left: 60 };
const svgWidth = 800;
const svgHeight = 500;
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create the SVG container
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define the tooltip
const tooltip = d3.select("#tooltip");


// Fallback CSV data embedded as a string. This allows the visualization to
// render locally (file:// protocol) when loading external files is not
// permitted by the browser. If the external CSV loads successfully, the
// fallback is ignored.
const fallbackCSV = `species,island,bill_length_mm,bill_depth_mm,flipper_length_mm,body_mass_g,sex,year
Adelie,Torgersen,39.1,18.7,181,3750,male,2007
Adelie,Torgersen,39.5,17.4,186,3800,female,2007
Adelie,Torgersen,40.3,18,195,3250,female,2007
Adelie,Torgersen,36.7,19.3,193,3450,female,2007
Adelie,Torgersen,39.3,20.6,190,3650,male,2007
Adelie,Torgersen,38.9,17.8,181,3625,female,2007
Adelie,Torgersen,39.2,19.6,195,4675,male,2007
Adelie,Torgersen,34.1,18.1,193,3475,,2007
Adelie,Torgersen,42,20.2,190,4250,,2007
Adelie,Torgersen,37.8,17.1,186,3300,,2007
Adelie,Torgersen,37.8,17.3,180,3700,,2007
Adelie,Torgersen,41.1,17.6,182,3200,female,2007
Adelie,Torgersen,38.6,21.2,191,3800,male,2007
Adelie,Torgersen,34.6,21.1,198,4400,male,2007
Adelie,Torgersen,36.6,17.8,185,3700,female,2007
Adelie,Torgersen,38.7,19,195,3450,female,2007
Adelie,Torgersen,42.5,20.7,197,4500,male,2007
Adelie,Torgersen,34.4,18.4,184,3325,female,2007
Adelie,Torgersen,46,21.5,194,4200,male,2007
Adelie,Biscoe,37.8,18.3,174,3400,female,2007
Adelie,Biscoe,37.7,18.7,180,3600,male,2007
Adelie,Biscoe,35.9,19.2,189,3800,female,2007
Adelie,Biscoe,38.2,18.1,185,3950,male,2007
Adelie,Biscoe,38.8,17.2,180,3800,male,2007
Adelie,Biscoe,35.3,18.9,187,3800,female,2007
Adelie,Biscoe,40.6,18.6,183,3550,male,2007
Adelie,Biscoe,40.5,17.9,187,3200,female,2007
Adelie,Biscoe,37.9,18.6,172,3150,female,2007
Adelie,Biscoe,40.5,18.9,180,3950,male,2007
Adelie,Dream,39.5,16.7,178,3250,female,2007
Adelie,Dream,37.2,18.1,178,3900,male,2007
Adelie,Dream,39.5,17.8,188,3300,female,2007
Adelie,Dream,40.9,18.9,184,3900,male,2007
Adelie,Dream,36.4,17,195,3325,female,2007
Adelie,Dream,39.2,21.1,196,4150,male,2007
Adelie,Dream,38.8,20,190,3950,male,2007
Adelie,Dream,42.2,18.5,180,3550,female,2007
Adelie,Dream,37.6,19.3,181,3300,female,2007
Adelie,Dream,39.8,19.1,184,4650,male,2007
Adelie,Dream,36.5,18,182,3150,female,2007
Adelie,Dream,40.8,18.4,195,3900,male,2007
Adelie,Dream,36,18.5,186,3100,female,2007
Adelie,Dream,44.1,19.7,196,4400,male,2007
Adelie,Dream,37,16.9,185,3000,female,2007
Adelie,Dream,39.6,18.8,190,4600,male,2007
Adelie,Dream,41.1,19,182,3425,male,2007
Adelie,Dream,37.5,18.9,179,2975,,2007
Adelie,Dream,36,17.9,190,3450,female,2007
Adelie,Dream,42.3,21.2,191,4150,male,2007
Gentoo,Biscoe,46.1,13.2,211,4500,female,2007
Gentoo,Biscoe,50,16.3,230,5700,male,2007
Gentoo,Biscoe,48.7,14.1,210,4450,female,2007
Gentoo,Biscoe,50,15.2,218,5700,male,2007
Gentoo,Biscoe,47.6,14.5,215,5400,male,2007
Gentoo,Biscoe,46.5,13.5,210,4550,female,2007
Gentoo,Biscoe,45.4,14.6,211,4800,female,2007
Gentoo,Biscoe,46.7,15.3,219,5200,male,2007
Gentoo,Biscoe,43.3,13.4,209,4400,female,2007
Gentoo,Biscoe,46.8,15.4,215,5150,male,2007
Gentoo,Biscoe,40.9,13.7,214,4650,female,2007
Gentoo,Biscoe,49,16.1,216,5550,male,2007
Gentoo,Biscoe,45.5,13.7,214,4650,female,2007
Gentoo,Biscoe,48.4,14.6,213,5850,male,2007
Gentoo,Biscoe,45.8,14.6,210,4200,female,2007
Gentoo,Biscoe,49.3,15.7,217,5850,male,2007
Gentoo,Biscoe,42,13.5,210,4150,female,2007
Gentoo,Biscoe,49.2,15.2,221,6300,male,2007
Gentoo,Biscoe,46.2,14.5,209,4800,female,2007
Gentoo,Biscoe,48.7,15.1,222,5350,male,2007
Chinstrap,Dream,46.5,17.9,192,3500,female,2007
Chinstrap,Dream,50,19.5,196,3900,male,2007
Chinstrap,Dream,51.3,19.2,193,3650,male,2007
Chinstrap,Dream,45.4,18.7,188,3525,female,2007
Chinstrap,Dream,52.7,19.8,197,3725,male,2007
Chinstrap,Dream,45.2,17.8,198,3950,female,2007
Chinstrap,Dream,46.1,18.2,178,3250,female,2007
Chinstrap,Dream,51.3,18.2,197,3750,male,2007
Chinstrap,Dream,46,18.9,195,4150,female,2007
Chinstrap,Dream,51.3,19.9,198,3700,male,2007
Chinstrap,Dream,46.6,17.8,193,3800,female,2007
Chinstrap,Dream,51.7,20.3,194,3775,male,2007
Chinstrap,Dream,47,17.3,185,3700,female,2007
Chinstrap,Dream,52,18.1,201,4050,male,2007
Chinstrap,Dream,45.9,17.1,190,3575,female,2007
Chinstrap,Dream,50.5,19.6,201,4050,male,2007
Chinstrap,Dream,50.3,20,197,3300,male,2007
Chinstrap,Dream,58,17.8,181,3700,female,2007
Chinstrap,Dream,46.4,18.6,190,3450,female,2007
Chinstrap,Dream,49.2,18.2,195,4400,male,2007
Chinstrap,Dream,42.4,17.3,181,3600,female,2007
Chinstrap,Dream,48.5,17.5,191,3400,male,2007
Chinstrap,Dream,43.2,16.6,187,2900,female,2007
Chinstrap,Dream,50.6,19.4,193,3800,male,2007
Chinstrap,Dream,46.7,17.9,195,3300,female,2007
Chinstrap,Dream,52,19,197,4150,male,2007`;

// Function to process the data and draw the chart
function processData(data) {
  // Filter out rows with missing numeric values. Note: d3.autoType will
  // convert missing numeric values to NaN.
  const filtered = data.filter(
    (d) => !isNaN(d.bill_length_mm) && !isNaN(d.flipper_length_mm)
  );

  // Create scales
  const x = d3
    .scaleLinear()
    .domain(d3.extent(filtered, (d) => d.bill_length_mm))
    .nice()
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(filtered, (d) => d.flipper_length_mm))
    .nice()
    .range([height, 0]);

  // Define color scale by species
  const species = Array.from(new Set(filtered.map((d) => d.species)));
  const color = d3.scaleOrdinal().domain(species).range(d3.schemeSet2);

  // Create axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Append axes
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g").attr("class", "axis y-axis").call(yAxis);

  // Axis labels
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .text("Bill length (mm)");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Flipper length (mm)");

  // Draw points
  const points = svg
    .selectAll(".dot")
    .data(filtered)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.bill_length_mm))
    .attr("cy", (d) => y(d.flipper_length_mm))
    .attr("r", 0) // start radius at 0 for animation
    .style("fill", (d) => color(d.species))
    .style("opacity", 0.75);

  // Animate circles growing to full size
  points
    .transition()
    .duration(800)
    .attr("r", 5);

  // Tooltip interactivity
  points
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr("r", 8);
      tooltip
        .style("opacity", 1)
        .html(
          `<strong>Species:</strong> ${d.species}<br>
           <strong>Island:</strong> ${d.island}<br>
           <strong>Bill length:</strong> ${d.bill_length_mm} mm<br>
           <strong>Flipper length:</strong> ${d.flipper_length_mm} mm<br>
           <strong>Body mass:</strong> ${d.body_mass_g} g`
        )
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 5);
      tooltip.transition().duration(300).style("opacity", 0);
    });

  // Add legend
  const legend = svg
    .selectAll(".legend")
    .data(species)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width + 40},${20 + i * 25})`);

  legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text((d) => d);
}

// Attempt to load the external CSV. If it fails (e.g., due to CORS restrictions
// when running from file://), fall back to the embedded CSV data. We use
// d3.autoType to automatically convert numeric columns.
d3.csv("data/penguins.csv", d3.autoType)
  .then((data) => {
    processData(data);
  })
  .catch(() => {
    // Parse the fallback data string and process it
    const data = d3.csvParse(fallbackCSV, d3.autoType);
    processData(data);
  });