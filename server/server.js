const express = require('express');
var https = require('https');
var cors = require('cors');
var fs = require('fs');

const response_helper = require('./response_helper');

const app = express();
const port = 8000;
const IP_VIGILANTE = 'https://ipvigilante.com/json/';

var allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
  // allow requests with no origin 
  // (like mobile apps or curl requests)
  if(!origin) return callback(null, true);
  if(allowedOrigins.indexOf(origin) === -1){
    var msg = 'The CORS policy for this site does not ' +
              'allow access from the specified Origin.';
    return callback(new Error(msg), false);
  }
  return callback(null, true);
}
}));

// Load data.csv, convert it to JSON and save it as an app variable
fs.readFile( __dirname + '/data.csv', function (err, data) {
  if (err) {
    throw err; 
  }
  var data = csvJSON(data.toString());
  app.set('bigMacData', data);
});

function csvJSON(csv){
  var lines=csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){
    var obj = {};
    var currentLine=lines[i].split(",");

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return JSON.stringify(result);
}

function searchData(value){
  var items = JSON.parse(app.get('bigMacData'));
  var startIndex  = 0;
  var stopIndex = items.length - 1;
  var middle = Math.floor((stopIndex + startIndex)/2);

  while(items[middle].Country != value && startIndex < stopIndex){
    if (value < items[middle].Country){
        stopIndex = middle - 1;
    } else if (value > items[middle].Country){
        startIndex = middle + 1;
    }
    middle = Math.floor((stopIndex + startIndex)/2);
  }

  // Find the latest data for the search point
  for (let i = middle + 1; i < items.length; i++) {
    if (items[i].Country === value) {
      middle = i;
    } else {
      break;
    }
  }
  
  return items[middle];
}

function getRandomData(value) {
  var items = JSON.parse(app.get('bigMacData'));
  var random = Math.floor(Math.random() * (items.length - 1)) + 1;
  var recentItem = random;
  if (items[random].Country != value) {
    // Found a different country other than the one specified
    // Find the latest data for the random country
    for (let i = random + 1; i < items.length; i++) {
      if (items[i].Country === items[random].Country) {
        recentItem = i;
      } else {
        break;
      }
    }
    return items[recentItem];
  } else (
    getRandomData(value)
  )
}

app.get('/get-country/:ip', function (req, res) {
  var ip = req.params.ip;

  https.get(IP_VIGILANTE + ip, (r) => {
    r.setEncoding('utf-8');
    r.on('data', (d) => {
      var json_d = JSON.parse(d);
      return response_helper.returnStatusError(r.statusCode, req, res, json_d);
    });
  })
});

app.get('/local-result/:country', function (req, res) {
  var latestResult = searchData(req.params.country);

  if (latestResult && latestResult.Country === req.params.country) {
    return response_helper.returnSuccessResponse(req, res, true, latestResult);
  } else {
    return response_helper.returnNotFound(req, res, "Unable to find record for specified country");
  }
});

app.get('/random-result/:country', function(req, res) {
  var countryResult = searchData(req.params.country);

  if (countryResult && countryResult.Country === req.params.country) {
    var randomResult = getRandomData(req.params.country);
    var output = {
      country_result: countryResult,
      random_result: randomResult
    };

    return response_helper.returnSuccessResponse(req, res, true, output);
  } else {
    return response_helper.returnNotFound(req, res, "Unable to find record for specified country")
  }
  
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;