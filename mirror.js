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

var clock = document.getElementById('clock');
var on = true;

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
  var minutes = date.getMinutes();
  var minutesStr = minutes < 10 ? '0' + minutes : minutes;
  clock.innerHTML = '<div>' + date.getHours() + colon + minutesStr + '</div><div>' + temp() + '</div>';
}
setInterval(run, 1000);
run();
