const request = require('request');
const temperature = require('./temperature');
const controls = require('./controls');

const purifier = require('./purifier')('192.168.0.4', 10000);
const getTemperature = temperature.init(1000, 5);

const url = 'http://kolodziejski.me/mirror/data/data.php';

function readAndSend () {
  var temperature = getTemperature();
  var purifierData = purifier.getData();

  let data = {
    timestamp: Date.now()
  };
  if (temperature != null) {
    data.temperature = temperature;
  }
  if (purifierData != null) {
    // TODO: rewrite all purifier fields to have purifier prefix or have separate object
    data.aqi = purifierData.aqi;
    data.humidity = purifierData.humidity;
    data.purifierTemperature = purifierData.temperature;
    data.purifierMode = purifierData.mode;
  }
  console.log(data);

  request.post({url, form: {data: JSON.stringify(data)}}, function (error, httpResponse, body) {
    // log?
  });
}

// Purifier "cron"
setInterval(function() { 
  let date = new Date();
  console.log(date);
  if (date.getHours() === 23 && date.getMinutes() === 0) {
    purifier.setMode('silent');
  }

  if (date.getHours() === 9 && date.getMinutes() === 0) {
    purifier.setMode('auto');
  }
}, 10000);

// read every half-minute
setInterval(readAndSend, 30000);
readAndSend();

controls.start();
