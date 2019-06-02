function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`metadata/${sample}`).then(function(data) { 
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    sample_metadata.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key,value]) {
      var row = sample_metadata.append('p');
      row.text(`${key}: ${value}\n`);
    });
  });  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`samples/${sample}`).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_parms = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: [[0, 'rgb(243, 115, 112)'], [1, 'rgb(20, 60, 144']],
        showscale: true,
        colorbar: {
          thickness: 15,
          y: 0.5,
          ypad: 0,
          title: 'OTU ID',
          titleside: 'top'
        },
        sizeref: 0.1,
        sizemode: 'area'
      },
    };
    var bubble_layout = {
      title: `Biodiversity in sample #${sample}`,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Bacteria Count'}
    };
    var bubbles = [bubble_parms];

    Plotly.newPlot('bubble',bubbles,bubble_layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_parms = {
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels,
      type: 'pie',
      marker: {colors:['gold','grey','green','honeydew','hotpink',
      'indigo','khaki','orchid','peru','red']},
    };
    var pie_layout = {
      title: `Sample #${sample} - Top 10 OTU IDs`,
    };
    var slices = [pie_parms];

    Plotly.newPlot('pie', slices, pie_layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
