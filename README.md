# Project-3 
## Students: Astrid Apopa / Grace Shi / Jordan Siegel / Paola Moreno / Zac Belcher

### Proposal
We are conducting an analysis of three major restaurant chains: McDonald's, Dunkin' Donuts, and Subway. Our objective is to evaluate and visualize the risk levels associated with these restaurants based on health and safety violations. For our data collection, we will gather health inspection data and classify restaurants into different risk levels (eg: low, medium, high) based on the frequency and severity of violations. By using JavaScript and Plotly we aim to provide a data-driven perspective on the health and safety performance of the popular restaurant chains.

Data source: [Chicago Food Inspections (kaggle.com)](https://www.kaggle.com/datasets/chicago/chicago-food-inspections?resource=download)

### Over View
For our project, we cleaned the metadata by filtering through and including the specific chains of interest. A restaurant chain may have different names that they go through so we made sure to include a filter that contains the string we want to include. After cleaning, we put the cleaned data into a pgAdmin database as well as also export the cleaned csv into a json file. The cleaned json file was referenced in writing the javascript code. 

To use the website, the initial page shows a bar graph visualization that compares the number of restaurant chains that passed vs the number of chains that failed for all three chains. Below the bar graph is a pie chart that shows the breakdown of what chains are categorized as high, medium and low risk for all chains. Finally, is a map that has markers of all restaurants, chains that failed inspection are seen with red markers, whereas those who passed are displayed as green. When a failed marker is selected, the violations of chain are shown below. There is a drop down menu at the top of the page that allows the viewer to toggle between all the chains or switch betwen each one.

### Ethics
While working on this project, there are a few ethical considerations. The inspections in the database were conducted starting in 2010. It should be noted that the qualifications necessary to pass at that time may be different than the qualifications needed to pass now. There is also no information about how this data was collected. While analyzing the data it is important to note the implicit biases that may be present from the inspector during inspection, such biases may include a preconceived ideals that may affect objective ratings.


sources (this assignment was written with help from sites below as well as course materials/instructor code, and tutoring help):
https://plotly.com/javascript/bar-charts/
https://d3js.org/d3-format
https://www.highcharts.com/demo/highcharts/pie-chart
https://leafletjs.com/
[chatgpt.](https://chatgpt.com/)
