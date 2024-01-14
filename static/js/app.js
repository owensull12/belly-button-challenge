let data = d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json')
console.log(data)

// add metadata info to the demographic info section
function demographics(sample)
{
    console.log(sample)

    data.then((data) => {
        let metadata = data.metadata

        // filter metadata based on the value of sample
        let currentData = metadata.filter(currentSample => currentSample.id == sample)

        //console.log(currentData)

        // get only the keys and values for the filtered dropdown option
        let currentSampleData = currentData[0]

        // clear the metadata section for the next dropdown item selected
        d3.select('#sample-metadata').html('')

        Object.entries(currentSampleData).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`)
        })
    })
}

// create the bar chart
function barChart(sample)
{  
    data.then((data) => {
        let sampleData = data.samples

        // filter metadata based on the value of sample
        let currentData = sampleData.filter(currentSample => currentSample.id == sample)

        // get only the keys and values for the filtered dropdown option
        let currentSampleData = currentData[0]

        // get each element of the bar chart
        let otuIDs = currentSampleData.otu_ids
        let otuLabels = currentSampleData.otu_labels
        let sampleValues = currentSampleData.sample_values

        // top 10 otu values
        let yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`)
        let xValues = sampleValues.slice(0, 10)
        let barLabels = otuLabels.slice(0, 10)

        // bar chart parameters
        let barChart = {
            y: yticks.reverse(), // .reverse() to have largest values be at the top
            x: xValues.reverse(),
            text: barLabels,
            type: 'bar',
            orientation: 'h'
        }

        Plotly.newPlot('bar', [barChart])
    })
}

// bubble chart
function bubbleChart(sample)
{
    data.then((data) => {
        let sampleData = data.samples

        // filter metadata based on the value of sample
        let currentData = sampleData.filter(currentSample => currentSample.id == sample)

        // get only the keys and values for the filtered dropdown option
        let currentSampleData = currentData[0]

        // get each element of the bubble chart
        let otuIDs = currentSampleData.otu_ids
        let otuLabels = currentSampleData.otu_labels
        let sampleValues = currentSampleData.sample_values

        // bubble chart parameters
        let bubbleChart = {
            y: sampleValues,
            x: otuIDs,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: 'Jet'
            }
        }

        let layout = {
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'}
        }

        Plotly.newPlot('bubble', [bubbleChart], layout)
    })
}

// read in samples.json using D3 and set up dropdown
function init()
{
    // set where the options will go in the html file
    let options = d3.select('#selDataset')

    // add IDs to the dropdown area
    data.then((data) => {
        data.names.forEach((sample) => {
            options.append('option').text(sample) // create the dropdown items and add their text
            .property('value', sample) // set a value for the sample
        })

        let sample1 = data.names[0]
        // function to update metadata
        demographics(sample1)

        // update the bar chart
        barChart(sample1)

        // update the bubble chart
        bubbleChart(sample1)
    })
}

init()

// update dashboard based on dropdown selection
function optionChanged(item) // references onchange="optionChanged(this.value)" in the <select>
{
    // update metadata section
    demographics(item)

    // update the bar chart
    barChart(item)

    // update the bubble chart
    bubbleChart(item)
}