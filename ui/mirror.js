const screenfull = require('screenfull');
const nosleep = require('nosleep.js');
const url = require('../shared/url');
const io = require('socket.io-client');

const initialError = '↻';

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
  let data;

  const socket = io();
  socket.on('data', (x) => {
    data = x;
    console.log(data);
  });

  document.addEventListener('mouseup', onMouseUp, false);
  function onMouseUp(e){
    socket.emit('toggle-power');
  }

  return function () {
    return data;
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

    function getLocalTemperature (f) {
      try {
        let x = f(getHomeData());
        if (!Number.isFinite(x)) {
          throw x + ' is not a valid temperature';
        } else {
          return Math.round(f(getHomeData())) + '°C';
        }
      } catch (error) {
        return errorSpan(error);
      }
    }
    function getLocalHeating (f) {
      try {
        return f(getHomeData());
      } catch (error) {
        return false;
      }
    }
    function heatingStyle (isOn) {
      if (isOn) {
        return 'border-radius:30px; background: #fff; color: #000';
      } else {
        return '';
      }
    }
    let upHeating = getLocalHeating(x => x.upHeating.status);
    let downHeating = getLocalHeating(x => x.downHeating.status);
    let upTemperature = getLocalTemperature(x => x.purifier.temperature);
    let downTemperature = getLocalTemperature(x => x.temperature.data);
    return '<span style="display: inline-block; margin: 0 50px"> \
              <span style="display: inline-block; font-size: 60%; text-align: right"> \
                <div><span style="display: inline-block; text-align: right; clear: right; ' + heatingStyle(upHeating) + '">' + upTemperature + '</span></div>\
                <div><span style="display: inline-block; margin-right: 80px; ' + heatingStyle(downHeating) + '">' + downTemperature + '</span></div>\
              </span> | ' + remote +
           '</span>';
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
    local = Math.round(getHomeData().purifier.aqi);
  } catch (error) {
    local = errorSpan(error);
  }
  return '<div>' + local + ' <span class="pm25">PM2.5</span></div>';
}

function getTvSocket () {
  let data = getHomeData().tvSocket;
  if (data.status != null) {
    if (data.status) {
      return '<div>on</div>';
    } else {
      return '<div>off</div>';
    }
  }
  return '';
}

window.ticking = true;
function run () {
  if (!window.ticking) return;

  on = !on;
  let colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  let date = new Date();
  let data = '';
  data += '<div class="aqi">' + getAqi() + '</div>';
  data += '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="tvSocket">' + getTvSocket() + '</div>';
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
