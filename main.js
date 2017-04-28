const fs = require('fs');
const request = require('request');

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

// https://learn.adafruit.com/adafruits-raspberry-pi-lesson-11-ds18b20-temperature-sensing?view=all
function doRead (deviceId) {
  let filename = '/sys/bus/w1/devices/' + deviceId + '/w1_slave';
  let result = fs.readFileSync(filename).toString();
  if (/crc=.*YES/.test(result)) {
    return (+result.match(/t=(-?\d+)/)[1]) / 1000;
  } else {
    throw 'No correct temperature found: ' + filename + '(' + result + ')';
  }
}

var read = (function () {
  var temperatures = [];

  function loop() {
    try {
      temperatures.push(doRead('28-0216252dbfee'));
    } catch (e) {
      console.error(e);
    }
    setTimeout(loop, 2000);
  }
  loop();

  function getResult () {
    var data = {
      temperature: median(temperatures),
      timestamp: Date.now()
    };

    temperatures = [];

    if (data.temperature != null) {
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
console.log(data);
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
