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

// keeps calling callback 
function updater (url, callback) {
  const outdated = 70000; // ~minute + eps
  const delay = 30000;

  let lastUpdate = Date.now();
  function update () {
    let age = Date.now() - lastUpdate;
    if (outdated < age) {
      callback('Data out of date. Last success: ' + Math.floor(age / 60000) + 'm ago');
    }
    getJSONData(url, function (err, res) {
      if (!err) {
        lastUpdate = Date.now();
        callback(null, res);
      }
    });
  }
  update();
  setInterval(update, delay);
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
  const url = 'http://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric';

  let remoteTemperature;
  let remoteError = 'Waiting for data';
  updater(url, function (err, result) {
    remoteTemperature = result;
    remoteError = err;
  });

  let localTemperature;
  let localError = 'Waiting for data';
  const localUrl = 'http://kolodziejski.me/mirror/data/data.php';
  updater(localUrl, function (err, result) {
    localTemperature = result;
    localError = err;
  });

  return function () {
    let remote;
    if (remoteError) {
      remote = 'Couldn\'t get weather data: ' + remoteError;
    } else {
      remote = Math.round(remoteTemperature.main.temp) + '°C<span class="icon ' + iconMap[remoteTemperature.weather[0].icon] + '"></span>';
    }

    let local;
    if (localError) {
      local = 'Couldn\'t get indoor temperature: ' + localError;
    } else {
 console.log(localTemperature);
      local = Math.round(localTemperature.temperature) + '°C';
    }

    return '<span style="display: inline-block; margin: 0 50px">' + local + ' | ' + remote + '</span>';
  };
})();

const contents = document.getElementById('contents');
let on = true;

function pad (n) {
  return n < 10 ? '0' + n : '' + n;
}

let getTfl = (function () {
  const url = 'https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUCFM?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';

  let data;
  let error;
  updater(url, function (err, result2) {
    error = err;
    data = result2;
  });

  return function () {
    if (!data) {
      return '<div>Deparatures unknown</div>';
    }
    if (error) {
      return '<div>Couldn\'t get deparatured. ' + error + '</div>';
    }
    return '<div style="margin: 40px">Morden via Bank: <ul>' + data.sort((x, y) => {
      return x.timeToStation - y.timeToStation;
    }).filter(x => {
      return x.towards.indexOf('Bank') > -1;
    }).map(x => {
      let time = x.timeToStation;
      let text = Math.floor (time / 60) + ':' + pad(time % 60);
      let width = (time / 60) + 'cm';
      let whiteText = '<div style="color: #fff">' + text + '</div>';
      let blackText = '<div style="color: #000; position: absolute; left: 0; top: 0; background: #fff; width: ' + width + '; overflow: hidden; border-radius: 3px">' + text + '</div>';

      return '<li style="position: relative; white-space: nowrap; margin: 0 0 10px">' + whiteText + blackText + '</li>';
    }).join(' ') + '</ul></div>';
  }
})();

function run () {
  on = !on;
  let colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  let date = new Date();
  let data = '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="weather">' + getTemperature() + '</div>';
  data += '<div class="trains">' + getTfl() + '</div>';

  contents.innerHTML = data;
}
setInterval(run, 1000);
run();
