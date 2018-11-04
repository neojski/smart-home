const initialError = '↻';

const screenfull = require('screenfull');
const nosleep = require('nosleep.js');

const url = require('../shared/url');

function errorSpan (c) {
  return '<span class="error">' + c + '</span>';
}

function getJSONData(url, callback) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let error = function () {
      reject ("XMLHttpRequest failed. Status: " + xhr.status + ". statusText: " + xhr.statusText);
    };
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve (JSON.parse(this.responseText));
      } else {
        error ();
      }
    };
    xhr.onerror = error;
    xhr.open('GET', url, true);
    xhr.send(null);
  });
}

function updater ({url, hasTimestamp}, callback) {
  const maxTries = 3;
  const maxAcceptableAge = 60000; // in ms

  let error = function (e) {
    callback(e);
  };
  let ok = function (res) {
    callback(null, res);
  };
  async function update () {
    try {
      let now = Date.now ();
      let res = await getJSONData(url);
      let timestamp = null;
      if (hasTimestamp) {
        timestamp = new Date (res.timestamp);
      } else {
        timestamp = now;
      }
      let age = now - timestamp;
      if (age > maxAcceptableAge) {
        return error('Out of date. Last update: ' + timestamp);
      }
      return ok (res);
    } catch (e) {
      return error(e);
    }
  }
  update();
  setInterval(update, maxAcceptableAge / maxTries);
}

// TODO: home data timestamps should be per device really
const getHomeData = (function () {
  let err;
  let result;
  updater({url: url.data, hasTimestamp: true}, function (err2, result2) {
    err = err2;
    result = result2;
  });
  return function () {
    if (err != null) {
      throw err;
    }
    return result;
  };
})();

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
  const url = 'https://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric';

  let remoteTemperature;
  let remoteError = initialError;
  updater({url, hasTimestamp: false}, function (err, result) {
    remoteTemperature = result;
    remoteError = err;
  });

  return function () {
    let remote;
    if (remoteError) {
      remote = errorSpan(remoteError);
    } else {
      remote = Math.round(remoteTemperature.main.temp) + '°C<span class="icon ' + iconMap[remoteTemperature.weather[0].icon] + '"></span>';
    }

    function getLocal (f) {
      try {
        return Math.round(f(getHomeData())) + '°C';
      } catch (error) {
        return errorSpan(error);
      }
    }
    let localUp = getLocal(x => x.purifierTemperature);
    let localDown = getLocal(x => x.temperature);
    return '<span style="display: inline-block; margin: 0 50px"><span style="display: inline-block; font-size: 60%"><span style="display: block; text-align: right">' + localUp + '</span><span style="display: block; margin-right: 80px">' + localDown + '</span></span> | ' + remote + '</span>';
  };
})();

const contents = document.getElementById('contents');
let on = true;

function pad (n) {
  return n < 10 ? '0' + n : '' + n;
}

let getTfl = (function () {
  // Chalk Farm: 940GZZLUCFM
  // Belsize Park: 940GZZLUBZP
  const url = 'https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUBZP?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';

  let data;
  let error = initialError;
  updater({url, hasTimestamp: false}, function (err, result) {
    error = err;
    data = result;
  });

  return function () {
    if (error) {
      return '<div>' + errorSpan(error) + '</div>';
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

function getAqi () {
  let local;
  try {
    local = Math.round(getHomeData().aqi);
  } catch (error) {
    local = errorSpan(error);
  }
  return '<div>' + local + ' <span class="pm25">PM2.5</span></div>';
}

let ticking = true;
function run () {
console.log(ticking);
  if (!ticking) return;

  on = !on;
  let colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  let date = new Date();
  let data = '';
  data += '<div class="aqi">' + getAqi() + '</div>';
  data += '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="weather">' + getTemperature() + '</div>';
  data += '<div class="trains">' + getTfl() + '</div>';

  contents.innerHTML = data;
}
setInterval(run, 1000);
run();

let fullscreen = false;
const noSleep = new nosleep();
document.onclick = function () {
  fullscreen = !fullscreen;
  if (fullscreen) {
    screenfull.request();
    noSleep.enable();
  } else {
    screenfull.exit();
    noSleep.disable();
  }
};
