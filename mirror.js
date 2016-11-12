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

var getTfl = (function () {
  var data = [];

  function getData () {
    var url = 'https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUCFM?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        data = JSON.parse(xhr.responseText);
      }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  }
  getData();
  setInterval (getData, 10 * 1000);

  return function () {
    return '<div class="trains">Deparatures to Morden via Bank: <ul>' + data.sort((x, y) => {
      return x.timeToStation - y.timeToStation;
    }).filter(x => {
      return x.towards.indexOf('Bank') > -1;
    }).map(x => {
      debugger;
      var time = x.timeToStation;
      return '<li>' + Math.floor (time / 60) + 'm ' + (time % 60) + 's</li>';
    }).join(' ') + '</ul></div>';
  }
})();

function run () {
  on = !on;
  var colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  var date = new Date();
  var data = '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="temperature">' + temp() + '</div>';
  data += '<div class="">' + getTfl() + '</div>';

  contents.innerHTML = data;
}
setInterval(run, 1000);
run();
