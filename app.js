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
      outboundDateString: "05/04/2017",
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
        var jsonFied = splitFlightDetails.map((flightDetail, index) => {
          return `"${flightDetailsOrder[index]}": "${flightDetail}"`;
        });
        wannaGetAwayPrices.push(`{${jsonFied}}`);
      }

    })
    .set('flightResults')
  .done(function(result) {
    fs.writeFile("test", `[${wannaGetAwayPrices}]`, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
    
  })
.log(console.log)
.error(console.log)
.debug(console.log)

app.listen(3000, function() {
  console.log('listening');
});