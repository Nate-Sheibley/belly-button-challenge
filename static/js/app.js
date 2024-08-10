// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let filtered = metadata.filter(sampleData => sampleData.id === parseInt(sample));
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata_panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadata_panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let meta_data_object = filtered[0];
    let keys = Object.keys(meta_data_object);
    // for each key build the display string and append it to the html div
    keys.forEach(key => {
      let line_string = `${key.toUpperCase()}: ${meta_data_object[key]}`;
      metadata_panel.append('p').text(line_string);
    });
    // console.log(`Metadata updated for sample: ${sample}`);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let bact_samples = data.samples;
    // Filter the samples for the object with the desired sample number
    let filtered = bact_samples.filter(sampleData => sampleData.id == sample)[0];

    // Declare plotting variables
    let otu_ids = filtered.otu_ids;
    // bubble: x-val, colors
    // bar: y-val
    let sample_values = filtered.sample_values;
    // bubble: y-val, size
    // bar: x-val
    let otu_labels = filtered.otu_labels;
    // bubble: hover text
    // bar: hover text

    // Build a Bubble Chart
    let bubble_data = [{ 
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        //change scale so it's closer to the example
        sizeref: 1.5
      }
    }];

    let bubble_layout = {
      title : "Bacteria Culture Per Sample",
      xaxis : {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    };

    // Render the Bubble Chart  
    Plotly.newPlot("bubble", bubble_data, bubble_layout);
    // console.log(`Bubble plot updated for sample: ${sample}`);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
  
    let bar_data = [{
      type: 'bar',
      orientation: 'h',
      x: sample_values,
      //This slices the top 10 AFTER sorting... does not look like it should
      y: otu_ids.map(id => `OTU ${id}`).slice(0,10),
      text: otu_labels,
      // sort the data ascending according to sample_values
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending'
      }]
    }];

    let bar_layout = {
      title : "Top 10 Bacteria Cultures Found",
      xaxis : {
        title: "Number of Bacteria"
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);
    // console.log(`Bar chart updated for sample: ${sample}`);
  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_ids = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sample_ids.forEach(id => {
      dropdown.append('option').attr('value', id).attr('label', id);
    });

    // Get the first sample from the list
    let first_sample = dropdown.select('option').property("value");
    // Build charts and metadata panel with the first sample
    // console.log('init() ended. Moving on to first sample');
    optionChanged(first_sample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  console.log(`Sample ${newSample} selected`);
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();

d3.select('#selDataset').on('change', event => optionChanged(event.target.value));
