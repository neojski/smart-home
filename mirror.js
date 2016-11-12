var weather = require('weather-js');

// returns temperature or null if not available
var getTemperature = (function () {
  var temperature = null;
  function updateTemperature () {
    weather.find({search: 'London, UK, NW3 3LZ', degreeType: 'C'}, function(err, result) {
      if(err) {
        console.log(result, err);
        return;
      }
      temperature = result[0].current.temperature;
    });
  }
  updateTemperature();
  setInterval(updateTemperature, 100 * 1000);
  return function () {
    return temperature;
  };
})();

var contents = document.getElementById('contents');
var on = true;

function pad (n) {
  return n < 10 ? '0' + n : '' + n;
}

function temp () {
  var temperature = getTemperature();
  if (temperature !== null) {
    return temperature + '°C';
  } else {
    return '';
  }
}

function run () {
  on = !on;
  var colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  var date = new Date();
  var data = '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="temperature">' + temp() + '</div>';

  contents.innerHTML = data;
}
setInterval(run, 1000);
run();
