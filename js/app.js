 // Function to fetch JSON data
 function fetchData() {
  return fetch('resources/filtered_chains.json')
    .then(response => response.json());
}

// Function to generate bar chart
function generateBarChart(data) {
  const chains = [...new Set(data.map(entry => entry['DBA Name']))];
  const passCounts = [];
  const failCounts = [];
  const barData = [];

  chains.forEach(chain => {
    const chainData = data.filter(entry => entry['DBA Name'] === chain);
    let passCount = chainData.filter(entry => entry['Results'] === 'Pass').length;
    let failCount = chainData.filter(entry => entry['Results'] === 'Fail').length;
    passCounts.push(passCount);
    failCounts.push(failCount);
    barData.push({ x: ['Pass', 'Fail'], y: [passCount, failCount], type: 'bar', name: chain });
  });

  const layout = {
    title: 'Pass vs Fail by Chain',
    xaxis: { title: 'Result' },
    yaxis: { title: 'Count' }
  };

  Plotly.newPlot('bar-chart', barData, layout);

  const dropdown = document.getElementById('chain-dropdown');
  const allOption = document.createElement('option');
  allOption.text = 'All';
  allOption.value = 'All';
  dropdown.add(allOption);

  chains.forEach(chain => {
    const option = document.createElement('option');
    option.text = chain;
    option.value = chain;
    dropdown.add(option);
  });

  dropdown.addEventListener('change', function() {
    const selectedChain = this.value;
    if (selectedChain === 'All') {
      Plotly.newPlot('bar-chart', barData, layout);
    } else {
      const index = chains.indexOf(selectedChain);
      const newData = [barData[index]];
      Plotly.react('bar-chart', newData, layout);
    }
    updateMapMarkers(data, selectedChain);
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
  violationsList = document.getElementById('violations-list');

  updateMapMarkers(data, 'All');
}

// Function to update the markers on the map based on the selected chain
function updateMapMarkers(data, selectedChain) {
  markerLayerGroup.clearLayers();
  violationsList.innerHTML = ''; // Clear previous violations
  document.getElementById('violations-summary').style.display = 'none'; // Hide violations summary

  const failIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <svg width="16" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C8.13 0 5 3.13 5 7c0 4.97 7 13 7 13s7-8.03 7-13c0-3.87-3.13-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="red"/>
      </svg>
    `,
    iconSize: [16, 24],
    iconAnchor: [8, 24]
  });

  const passIcon = L.divIcon({
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
          const marker = L.marker([entry.Latitude, entry.Longitude], { icon: failIcon })
            .bindPopup(`<b>${entry['DBA Name']}</b><br>${entry.Address}<br>${entry.City}, ${entry.State} ${entry.Zip}<br><strong>Result:</strong> ${entry.Results}`);

          // Add click event to marker to open popup and show violations summary
          marker.on('click', function() {
            if (entry.Violations) {
              violationsList.innerHTML = `<li><b>${entry['DBA Name']}</b>: ${entry.Violations}</li>`;
            } else {
              violationsList.innerHTML = `<li><b>${entry['DBA Name']}</b>: No violations found.</li>`;
            }
            document.getElementById('violations-summary').style.display = 'block'; // Show violations summary
            marker.openPopup();
          });

          markerLayerGroup.addLayer(marker);
        }
      } else if (entry.Results === 'Pass') {
        if (selectedChain === 'All' || entry['DBA Name'] === selectedChain) {
          const marker = L.marker([entry.Latitude, entry.Longitude], { icon: passIcon })
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
  }).catch(error => {
    console.error('Error fetching or parsing data:', error);
  });
}

// Call the initializePage function when the page loads
window.onload = initializePage;