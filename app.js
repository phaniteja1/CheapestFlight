var path = require('path');
var express = require('express');
var osmosis = require('osmosis');
var cheerio = require('cheerio');
var fs = require('fs');


var app = express();

// Flight times
const flightTimes = {
  "anytime":   "ANYTIME",
  "morning":   "BEFORE_NOON",
  "afternoon": "NOON_TO_6PM",
  "evening":   "AFTER_6PM"
}

var currentFlightModel = {
  'flightno': '',
  'price': '',
  'depart': '',
  'arrive': ''
}

var defaultFlightModel = {
  'flightno': '',
  'price': '',
  'depart': '',
  'arrive': ''
}

const flightDetailsOrder = ["flightno", "price", "depart", "arrive"];

var i = 0;
let wannaGetAwayPrices = [];

osmosis
.get("https://www.southwest.com")
.submit(".booking-form--form", {
      originAirport: 'DAL',
      destinationAirport: 'LGA',
      twoWayTrip: false,
      // airTranRedirect: "",
      // returnAirport: "RoundTrip",
      outboundTimeOfDay: flightTimes["anytime"],
      // returnTimeOfDay: flightTimes["anytime"],
      // seniorPassengerCount: 0,
      fareType: "DOLLARS",
      outboundDateString: "05/10/2017",
      // returnDateString: "04/20/2017",
      adultPassengerCount: "1",
    })
    
    .find('#faresOutbound .nonstop .product_info input')
    .then((flightInfo) => {
      var totalFlightDetails = flightInfo.title;
      var cleanedFlightDetails = '';
      if (totalFlightDetails)
        cleanedFlightDetails = totalFlightDetails.replace(/Departing flight |depart | arrive Nonstop/g , "");
      if (cleanedFlightDetails){
        var splitFlightDetails = cleanedFlightDetails.split(' ');

        Object.keys(currentFlightModel).forEach(function(key,index) {
            currentFlightModel[key] = defaultFlightModel[key];
            currentFlightModel[key] = splitFlightDetails[index];
        });

        // var jsonFied = splitFlightDetails.map((flightDetail, index) => {
        //   return `${flightDetailsOrder[index]}": "${flightDetail}"`;
        // }).join(', ');
        wannaGetAwayPrices.push(currentFlightModel);
      }

    })
    .set('flightResults')
  .done(function(result) {
    // fs.writeFile("flights.json", `[${wannaGetAwayPrices}]`, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }

    //     console.log("The file was saved!");
    // }); 

  appendObject(wannaGetAwayPrices);
  })
.log(console.log)
.error(console.log)
.debug(console.log)

function appendObject(obj){
  var configFile = fs.readFileSync('./flights.json');
  var config = JSON.parse(configFile);
  config.push.apply(config, obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('./flights.json', configJSON);
}

app.listen(3000, function() {
  console.log('listening');
});