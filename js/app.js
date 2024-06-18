function buildchaindata(restaurant) {
    d3.json('resources/filtered_chains.json').then((data)=> {
        console.log("called buildchaindata",restaurant);
        
        // filter by chain restaurant
        let buildchainfilter = data.filter(chain=>chain['DBA Name']==restaurant);

    });
}

function buildCharts(restaurant) {
    d3.json('resources/filtered_chains.json').then((data)=>{
        let rating= data['Results'];
        let restaurantchain=data['DBA Name'];

        // Count pass/fail results, writen with chatgpt
        let passFailCount = { pass: 0, fail: 0 };
        filteredData.forEach(chain => {
            if (chain.Result === "Pass") {
                passFailCount.pass++;
            } else if (chain.Result === "Fail") {
                passFailCount.fail++;
            }
        });
        var barlayout ={
            title: 'Chain Restaurant vs Pass/Fail Rating',
            xaxis: {title:'Restaurant Ratings'},
            yaxis:{title:'Number of Restaurants'}
        };
        
        var barchart= [{
            x: ['Pass','Fail'],
            y: [passFailCount.pass,passFailCount.fail]
            type: 'bar',

        }];
    });
}