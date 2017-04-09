var sensor = require('node-dht-sensor');
var request = require('request');

const url = 'http://kolodziejski.me/mirror/data/data.php';

function median (arr) {
  if (arr.length === 0) {
    return null;
  }
  arr.sort();
  if (arr.length % 2 === 0) {
    return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
  } else {
    return arr[(arr.length - 1) / 2];
  }
}

var read = (function () {
  var temperatures = [];
  var humidities = [];

  function doRead() {
    sensor.read(11, 2, function(err, temperature, humidity) {
      if (!err) {
        temperatures.push(temperature);
        humidities.push(humidity);
      } else {
        console.log(err);
      }
    });
  }

  doRead();
  setInterval(doRead, 2000); // recommended by device data-sheet

  function getResult () {
    var data = {
      temperature: median(temperatures),
      humidity: median(humidities),
      timestamp: Date.now()
    };

    temperatures = [];
    humidities = [];

    if (data.temperature != null && data.humidity != null) {
      return data;
    } else {
      return null;
    }
  }

  return getResult;
})();

function readAndSend () {
  var data = read();
  if (data != null) {
    request.post({url, form: {data: JSON.stringify(data)}}, function (error, httpResponse, body) {
      // log?
    });
  } else {
    console.error('Couldn\'t get temperature or humidity');
  }
}


// read every half-minute
setInterval(readAndSend, 30000);
readAndSend();
