const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initializes the page with a default plot
function init() {

  // Select the dropdown menu from HTML file
  let dropdownMenu = d3.select("#selDataset");

  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {console.log(`Data: ${data}`);

      // Loop through a names Array appending each to the html file so that they appear as options in the dropdownMenu
      let names = data.names;
      names.forEach((name) => {dropdownMenu.append("option").text(name).property("value", name);});

      // Assign default name value for initial page load
      let name = names[0];

      // Create default/starter charts
      update_demographic_info(name);
      update_bar_chart(name);
      update_bubble_chart(name);
      update_gauge_chart(name);
  });
};

// Function to create/update the demographics panel
function update_demographic_info(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {console.log(`Data: ${data}`);
      
      // Collect Metadata, then filter it for IDs equal to selectedValue and assign first ID to obj variable
      let metadata = data.metadata;
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      let obj = filteredData[0]
      
      // Clears previously populated elements from sample-metadata div tag to prep for upcoming append
      d3.select("#sample-metadata").html("");

      // Save key, value pairs of obj to variable for upcoming loop
      let entries = Object.entries(obj);

      // Append demographics info to html file's sample-metadata div section
      entries.forEach(([key,value]) => {
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });
}

// Function to create/update the bar chart
function update_bar_chart(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {console.log(`Data: ${data}`);

      // Collect samples, then filter it for IDs equal to selectedValue and assign first ID to obj variable
      let samples = data.samples;
      let filteredData = samples.filter((sample) => sample.id === selectedValue);
      let obj = filteredData[0];
      
      // Set trace info for bar chart (using only top 10 otus)
      let trace = [{
          x: obj.sample_values.slice(0,10).reverse(),
          y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
          text: obj.otu_labels.slice(0,10).reverse(),
          type: "bar",
          marker: {color: "rgb(166,172,237)"},
          orientation: "h"
      }];
      
      // Plot bar chart
      Plotly.newPlot("bar", trace);
  });
};

// Function to create/update the bubble chart
function update_bubble_chart(selectedValue) {
  // Fetch the JSON data and console log it
  d3.json(url).then((data) => {console.log(`Data: ${data}`);

      // Collect samples, then filter it for IDs equal to selectedValue and assign first ID to obj variable
      let samples = data.samples;
      let filteredData = samples.filter((sample) => sample.id === selectedValue);
      let obj = filteredData[0];
      
      // Set trace info for bubble chart
      let trace = [{
          x: obj.otu_ids,
          y: obj.sample_values,
          text: obj.otu_labels,
          mode: "markers",
          marker: {
              size: obj.sample_values,
              color: obj.otu_ids,
              colorscale: "Sunset"
          }
      }];
  
      // Add title to the x-axis layout
      let layout = {
          xaxis: {title: "OTU ID"}
      };
  
      // Plot bubble chart
      Plotly.newPlot("bubble", trace, layout);
  });
};

// Make the gauge chart 
function update_gauge_chart(selectedValue) {
  // Fetch the JSON data
  d3.json(url).then((data) => {
      // Collect metadata, then filter it for IDs equal to selectedValue and assign first ID to obj variable
      let metadata = data.metadata;
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      let obj = filteredData[0]

      // Set trace info for gauge chart
      let trace = [{
          domain: { x: [0, 1], y: [0, 1] },
          value: obj.wfreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
          type: "indicator", 
          mode: "gauge+number",
          gauge: {
              axis: {range: [null, 10]}, 
              bar: {color: "rgb(68,166,198)"},
              steps: [
                  { range: [0, 1], color: "rgb(233,245,248)" },
                  { range: [1, 2], color: "rgb(218,237,244)" },
                  { range: [2, 3], color: "rgb(203,230,239)" },
                  { range: [3, 4], color: "rgb(188,223,235)" },
                  { range: [4, 5], color: "rgb(173,216,230)" },
                  { range: [5, 6], color: "rgb(158,209,225)" },
                  { range: [6, 7], color: "rgb(143,202,221)" },
                  { range: [7, 8], color: "rgb(128,195,216)" },
                  { range: [8, 9], color: "rgb(113,187,212)" },
                  { range: [9, 10], color: "rgb(98,180,207)" }
              ]
          }
      }];

       // Plot the gauge chart
       Plotly.newPlot("gauge", trace);
  });
};

// Update plots when an option is changed
function option_changed(selectedValue) {
    update_demographic_info(selectedValue);
    update_bar_chart(selectedValue);
    update_bubble_chart(selectedValue);
    update_gauge_chart(selectedValue);
};

// Call init function on page load
init();