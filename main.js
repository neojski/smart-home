const request = require('request');
const temperature = require('./temperature');
const controls = require('./controls');

const get_purifier = require('./purifier').init(10000);
const get_temperature = temperature.init(1000, 5);

const url = 'http://kolodziejski.me/mirror/data/data.php';

function readAndSend () {
  var temperature = get_temperature();
  var purifier_data = get_purifier();

  let data = {
    timestamp: Date.now()
  };
  if (temperature != null) {
    data.temperature = temperature;
  }
  if (purifier_data != null) {
    data.aqi = purifier_data.aqi;
    data.humidity = purifier_data.humidity;
  }
  console.log(data);

  request.post({url, form: {data: JSON.stringify(data)}}, function (error, httpResponse, body) {
    // log?
  });
}


// read every half-minute
setInterval(readAndSend, 3000);
readAndSend();

controls.start();
