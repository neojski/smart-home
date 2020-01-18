import screenfull0, { Screenfull } from 'screenfull';
import nosleep from 'nosleep.js';
import io from 'socket.io-client';
import { Data } from '../shared/Data';
import { broadcast } from '../shared/const';

// TODO: not sure why this casting is needed
const screenfull = screenfull0 as Screenfull;

const initialError = '↻';

function errorSpan(c: string) {
  return '<span class="error">' + c + '</span>';
}

async function getJSONData(url: string) {
  // around 2019-12-11 tfl started sending stale responses so we add this ugly cache busting URL param
  const response = await fetch(url + ('&cache' + Date.now()));
  return await response.json();
}

const maxAcceptableAgeMS = 60000;

// TODO: all fields should have an age check
function checkAge(lastUpdate: Date | undefined, maxAcceptableAgeMS: number) {
  if (lastUpdate) {
    const now = new Date();
    const ageInMs = now.getTime() - lastUpdate.getTime();

    if (ageInMs > maxAcceptableAgeMS) {
      return "last update " + Math.floor(ageInMs / 1000 / 60) + "m ago";
    }
    return false;
  } else {
    return "no timestamp";
  }
}

function updater(url: string, callback: { (err: string | null, result?: any): void }) {
  const maxTries = 3;

  let error = function (e: string) {
    callback(e);
  };
  let ok = function (res: any) {
    callback(null, res);
  };
  async function update() {
    try {
      let res = await getJSONData(url);
      return ok(res);
    } catch (e) {
      return error("" + e);
    }
  }
  update();
  setInterval(update, maxAcceptableAgeMS / maxTries);
}

const getHomeData = (function () {
  let data: Data = {};

  const socket = io();
  socket.on(broadcast, (x: Data) => {
    data = x;
    console.log(data);
  });

  document.addEventListener('mouseup', onMouseUp, false);
  function onMouseUp() {
    socket.emit('toggle-power');
  }

  return function () {
    return data;
  };
})();

function heatingStyle(isOn: boolean) {
  if (isOn) {
    return 'border-radius:30px; background: #fff; color: #000';
  } else {
    return '';
  }
}

// returns temperature or null if not available
const getTemperature = (function () {
  const iconMap = {
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
  } as const;

  //ljs15708@noicd.com
  //const url = "http://api.openweathermap.org/data/2.5/forecast/city?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2";
  const url = 'https://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric';

  let remoteTemperature: { main: { temp: number; }; weather: { icon: string }[]; };
  let remoteError: null | string = initialError;
  updater(url, function (err, result) {
    remoteTemperature = result;
    remoteError = err;
  });

  return function () {
    let remote;
    if (remoteError) {
      remote = errorSpan(remoteError);
    } else {
      const iconKey = remoteTemperature.weather[0].icon;
      const icon = (iconMap as { [x: string]: string | undefined })[iconKey];
      const iconEl = icon !== undefined ? '<span class="icon ' + icon + '"></span>' : '?';
      remote = Math.round(remoteTemperature.main.temp) + '°C' + iconEl;
    }

    function deserialiseDate(timestamp?: string) {
      if (timestamp) {
        return new Date(timestamp);
      }
      return undefined;
    }

    function getLocalTemperature(temperature: number | undefined, timestamp: Date | undefined, maxAcceptableAgeMS: number) {
      const error = checkAge(timestamp, maxAcceptableAgeMS);
      if (error === false) {
        if (temperature !== undefined) {
          if (!Number.isFinite(temperature)) {
            throw temperature + ' is not a valid temperature';
          } else {
            return Math.round(temperature) + '°C';
          }
        } else {
          return errorSpan("no temperature");
        }
      } else {
        return errorSpan(error);
      }
    }
    // TODO: default to error not false
    let upHeating = getHomeData().upHeating?.status ?? false;
    let downHeating = getHomeData().downHeating?.status ?? false;
    let upTemperature =
      // I don't actually know how long it takes for purifier to send updates
      getLocalTemperature(getHomeData().purifier?.temperature, deserialiseDate(getHomeData().purifier?.timestamp), 30 * 60 * 1000);
    let downTemperature = getLocalTemperature(getHomeData().temperature?.data, deserialiseDate(getHomeData().temperature?.timestamp), 60 * 1000);
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

function pad(n: number) {
  return n < 10 ? '0' + n : '' + n;
}

let getTfl = (function () {
  // Chalk Farm: 940GZZLUCFM
  // Belsize Park: 940GZZLUBZP
  const url = 'https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUBZP?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804';

  let data: { timeToStation: number; towards: string }[];
  let error: string | null = initialError;
  updater(url, function (err, result) {
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
      let text = Math.floor(time / 60) + ':' + pad(time % 60);
      let width = (time / 60) + 'cm';
      let whiteText = '<div style="color: #fff">' + text + '</div>';
      let blackText = '<div style="color: #000; position: absolute; left: 0; top: 0; background: #fff; width: ' + width + '; overflow: hidden; border-radius: 3px">' + text + '</div>';

      return '<li style="position: relative; white-space: nowrap; margin: 0 0 10px">' + whiteText + blackText + '</li>';
    }).join(' ') + '</ul></div>';
  }
})();

function getAqi() {
  let local;

  let aqi = getHomeData().purifier?.aqi;
  if (aqi !== undefined) {
    local = Math.round(aqi);
  } else {
    local = errorSpan("purifier undefined");
  }
  return '<div>' + local + ' <span class="pm25">PM2.5</span></div>';
}

function getTvSocket() {
  let data = getHomeData().tvSocket;
  if (data != null && data.status != null) {
    return '<div style="display: inline-block; width: 30px; height: 30px; line-height: 30px; text-align:center;' + heatingStyle(data.status) + '">⏻</div>';
  }
  return '';
}

(window as any).ticking = true;
function run() {
  if (!(window as any).ticking) return;

  on = !on;
  let colon = '<span style="visibility:' + (on ? "hidden" : "visible") + '">:</span>';
  let date = new Date();
  let data = '';
  data += '<div class="aqi">' + getAqi() + '</div>';
  data += '<div class="clock">' + pad(date.getHours()) + colon + pad(date.getMinutes()) + '<span class="secs">' + pad(date.getSeconds()) + '</span></div>';
  data += '<div class="tvSocket">' + getTvSocket() + '</div>';
  data += '<div class="weather">' + getTemperature() + '</div>';
  data += '<div class="trains">' + getTfl() + '</div>';

  contents!.innerHTML = data;
}
setInterval(run, 1000);
run();

let fullscreen = false;
const noSleep = new nosleep();
document.onclick = function () {
  fullscreen = !fullscreen;
  if (fullscreen) {
    (screenfull).request();
    noSleep.enable();
  } else {
    screenfull.exit();
    noSleep.disable();
  }
};
