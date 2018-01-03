const fs = require('fs');

function median (arr) {
  arr = arr.slice();
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

var temperatures = [];
function loop(samples) {
  try {
    temperatures.push(doRead('28-0216252dbfee'));
console.log(temperatures);
    temperatures = temperatures.slice(-samples);
  } catch (e) {
    console.error(e);
  }
}

function getResult () {
  return median(temperatures);
}

module.exports = {
  init : function (span, samples) {
    setInterval(() => loop(samples), span);
    loop(samples);
    return getResult;
  }
}
