// I'd rather prefer promises...
function getJSONData(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback({statusText: xhr.statusText});
      }
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}


// returns temperature or null if not available
const getTemperature = (function () {
  let iconMap = {
    '01d': 'icon-sun',
    '02d': 'icon-cloud-sun',
    '03d': 'icon-cloud',
    '04d': 'icon-clouds',
    '09d': 'icon-drizzle',
    '10d': 'icon-rain',
    '11d': 'icon-cloud-flash',
    '13d': 'icon-snow',
    '50d': 'icon-fog',
    '01n': 'icon-moon',
    '02n': 'icon-cloud-moon',
    '03n': 'icon-cloud',
    '04n': 'icon-clouds',
    '09n': 'icon-drizzle',
    '10n': 'icon-rain',
    '11n': 'icon-cloud-flash',
    '13n': 'icon-snow',
    '50n': 'icon-fog',
  };

  //ljs15708@noicd.com
  //const url = "http://api.openweathermap.org/data/2.5/forecast/city?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2";
  const url = "http://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric";
  let data = null;
  function updateTemperature () {
    getJSONData(url, function (err, result) {
      if (!err) {
        data = result;
      }
    });
  }
  updateTemperature();
  setInterval(updateTemperature, 60 * 1000);
  return function () {
    if (data) {
      return Math.round(data.main.temp) + '°C<span class="icon ' + iconMap[data.weather[0].icon] + '"></span><span class="description">' + data.weather[0].description + '</span>';
    } else {
      return '';
    }
  };
})();

const contents = document.getElementById('contents');
let on = true;

function pad (n) {
  return n < 10 ? '0' + n : '' + n;
}

let getTfl = (function () {
  let data = [];
  const url = 'https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUCFM?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';

  function getData () {
    // This is race-condition prone
    getJSONData(url, function (err, json) {
      if (!err) {
        data = json;
      }
    });
  }
  getData();
  setInterval (getData, 30 * 1000);

  return function () {
    return '<div class="trains">Deparatures to Morden via Bank: <ul>' + data.sort((x, y) => {
      return x.timeToStation - y.timeToStation;
    }).filter(x => {
      return x.towards.indexOf('Bank') > -1;
    }).map(x => {
      let time = x.timeToStation;
      return '<li>' + Math.floor (time / 60) + 'm ' + (time % 60) + 's</li>';
    }).join(' ') + '</ul></div>';
  }
})();

function run () {
  on = !on;
  let colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  let date = new Date();
  let data = '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="weather">' + getTemperature() + '</div>';
  data += '<div class="">' + getTfl() + '</div>';

  contents.innerHTML = data;
}
setInterval(run, 1000);
run();
