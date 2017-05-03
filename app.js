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
    .then((price) => {
      // var priceMarkup = price.toString().match(/\$.*?(\d+)/)
      // wannaGetAwayPrices.push(parseInt(priceMarkup[1]));
      // price = price.toString();
      // price = price.match(/title="([^']+)"/)[1];
      wannaGetAwayPrices.push(price);
    })
    .set('flightResults')
  .done(function(result) {

    
    // console.log(filteredResult)

    // console.log(i++)
    console.log(wannaGetAwayPrices);
    // wannaGetAwayPrices.forEach((price) => {
    //   console.log(price);
    // });
    
    fs.writeFile("test", wannaGetAwayPrices.join('\n'), function(err) {
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