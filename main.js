const request = require('request');
const temperature = require('./temperature');
const get_temperature = temperature.init(1000, 5);

const url = 'http://kolodziejski.me/mirror/data/data.php';

function readAndSend () {
  var temperature = get_temperature();
  if (temperature != null) {
    let data = {
      temperature: temperature,
      timestamp: Data.now()
    };
    console.log('temperature: ' + data);
    request.post({url, form: {data: JSON.stringify(data)}}, function (error, httpResponse, body) {
      // log?
    });
  } else {
    console.error('Couldn\'t get temperature');
  }
}


// read every half-minute
setInterval(readAndSend, 30000);
readAndSend();
