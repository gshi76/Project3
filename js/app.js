  // Function to fetch JSON data
  function fetchData() {
    return fetch('resources/filtered_chains.json')
      .then(response => response.json());
  }

  // Function to generate bar chart using D3
  function generateBarChart(data) {
    let chains = [...new Set(data.map(entry => entry['DBA Name']))];
    let passCounts = [];
    let failCounts = [];
    let barData = [];

    chains.forEach(chain => {
      let chainData = data.filter(entry => entry['DBA Name'] === chain);
      let passCount = chainData.filter(entry => entry['Results'] === 'Pass').length;
      let failCount = chainData.filter(entry => entry['Results'] === 'Fail').length;
      passCounts.push(passCount);
      failCounts.push(failCount);
      barData.push({ x: ['Pass', 'Fail'], y: [passCount, failCount], type: 'bar', name: chain });
    });

    let layout = {
      title: 'Pass vs Fail by Chain',
      xaxis: { title: 'Result' },
      yaxis: { title: 'Count' }
    };

    Plotly.newPlot('bar-chart', barData, layout);

    let dropdown = d3.select('#chain-dropdown');

    // Append the "All" option
    dropdown.append('option')
      .text('All')
      .attr('value', 'All');

    // Append options for each chain
    dropdown.selectAll('option.chain')
      .data(chains)
      .enter().append('option')
      .attr('value', d => d)
      .text(d => d);

    // Event listener for dropdown change
    dropdown.on('change', function() {
      let selectedChain = this.value;
      if (selectedChain === 'All') {
        Plotly.newPlot('bar-chart', barData, layout);
      } else {
        let index = chains.indexOf(selectedChain);
        let newData = [barData[index]];
        Plotly.react('bar-chart', newData, layout);
      }
      updateMapMarkers(data, selectedChain);
      updatePieChart(data, selectedChain);
    });

    // Initialize the pie chart with "All" data
    updatePieChart(data, 'All');
  }

  // Function to update the pie chart based on the selected chain
  function updatePieChart(data, selectedChain) {
    let filteredData = selectedChain === 'All' ? data : data.filter(entry => entry['DBA Name'] === selectedChain);
    let riskLevels = ['Risk 1 (High)', 'Risk 2 (Medium)', 'Risk 3 (Low)'];
    let riskCounts = [0, 0, 0]; // Initialize counts for each risk level

    filteredData.forEach(entry => {
      if (entry.Risk === 'Risk 1 (High)') riskCounts[0]++;
      else if (entry.Risk === 'Risk 2 (Medium)') riskCounts[1]++;
      else if (entry.Risk === 'Risk 3 (Low)') riskCounts[2]++;
    });

    Highcharts.chart('riskPieChart', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Risk Levels'
      },
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: [{
          name: riskLevels[0],
          y: riskCounts[0],
          color: '#f44336' // Red for high risk
        }, {
          name: riskLevels[1],
          y: riskCounts[1],
          color: '#ff9800' // Orange for medium risk
        }, {
          name: riskLevels[2],
          y: riskCounts[2],
          color: '#4caf50' // Green for low risk
        }]
      }]
    });
  }

  // Global variables to hold the map and marker layers
  let myMap;
  let markerLayerGroup;
  let violationsList; // Variable to hold reference to violations list

  // Function to initialize the map
  function initializeMap(data) {
    myMap = L.map("map", {
      center: [41.9, -87.7],
      zoom: 11
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    markerLayerGroup = L.layerGroup().addTo(myMap);

    // Create violations summary list
    violationsList = d3.select('#violations-list');

    updateMapMarkers(data, 'All');
  }

  // Function to update the markers on the map based on the selected chain
  function updateMapMarkers(data, selectedChain) {
    markerLayerGroup.clearLayers();
    violationsList.html(''); // Clear previous violations
    d3.select('#violations-summary').style('display', 'none'); // Hide violations summary

    let failIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <svg width="16" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C8.13 0 5 3.13 5 7c0 4.97 7 13 7 13s7-8.03 7-13c0-3.87-3.13-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="red"/>
        </svg>
      `,
      iconSize: [16, 24],
      iconAnchor: [8, 24]
    });

    let passIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <svg width="16" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C8.13 0 5 3.13 5 7c0 4.97 7 13 7 13s7-8.03 7-13c0-3.87-3.13-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="green"/>
        </svg>
      `,
      iconSize: [16, 24],
      iconAnchor: [8, 24]
    });

    data.forEach(entry => {
      if (entry.Latitude && entry.Longitude) {
        if (entry.Results === 'Fail') {
          if (selectedChain === 'All' || entry['DBA Name'] === selectedChain) {
            let marker = L.marker([entry.Latitude, entry.Longitude], { icon: failIcon })
              .bindPopup(`<b>${entry['DBA Name']}</b><br>${entry.Address}<br>${entry.City}, ${entry.State} ${entry.Zip}<br><strong>Result:</strong> ${entry.Results}`);

            // Add click event to marker to open popup and show violations summary
            marker.on('click', function() {
              if (entry.Violations) {
                violationsList.html(`<li><b>${entry['DBA Name']}</b>: ${entry.Violations}</li>`);
              } else {
                violationsList.html(`<li><b>${entry['DBA Name']}</b>: No violations found.</li>`);
              }
              d3.select('#violations-summary').style('display', 'block'); // Show violations summary
              marker.openPopup();
            });

            markerLayerGroup.addLayer(marker);
          }
        } else if (entry.Results === 'Pass') {
          if (selectedChain === 'All' || entry['DBA Name'] === selectedChain) {
            let marker = L.marker([entry.Latitude, entry.Longitude], { icon: passIcon })
              .bindPopup(`<b>${entry['DBA Name']}</b><br>${entry.Address}<br>${entry.City}, ${entry.State} ${entry.Zip}<br><strong>Result:</strong> ${entry.Results}`);

            markerLayerGroup.addLayer(marker);
          }
        }
      }
    });
  }

  // Function to initialize the page
  function initializePage() {
    fetchData().then(data => {
      generateBarChart(data);
      initializeMap(data);
    });
  }

  // Call the initializePage function when the page loads
  window.onload = initializePage;