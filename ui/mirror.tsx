import Screenfull from "screenfull";
import nosleep from "nosleep.js";
import io from "socket.io-client";
import { Data } from "../shared/Data";
import { broadcast } from "../shared/const";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Socket } from "../shared/Socket";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { getJSONData } from "./getJSONData";
import { errorSpan } from "./errorSpan";
import { Tfl } from "./Tfl";
import { heatingStyle } from "./heatingStyle";
import { Octopus } from "./Octopus";

export const initialError = "↻";

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

function updater(
  url: string,
  callback: { (err: string | null, result?: any): void }
) {
  const maxTries = 3;

  const error = function (e: string) {
    callback(e);
  };
  const ok = function (res: any) {
    callback(null, res);
  };
  async function update() {
    try {
      const res = await getJSONData(url);
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

  document.addEventListener("mouseup", onMouseUp, false);
  function onMouseUp() {
    socket.emit("toggle-power");
  }

  return function () {
    return data;
  };
})();

// returns temperature or null if not available
const getTemperature = (function () {
  const iconMap = {
    "01d": "icon-sun",
    "02d": "icon-cloud-sun",
    "03d": "icon-cloud",
    "04d": "icon-clouds",
    "09d": "icon-drizzle",
    "10d": "icon-rain",
    "11d": "icon-cloud-flash",
    "13d": "icon-snow",
    "50d": "icon-fog",
    "01n": "icon-moon",
    "02n": "icon-cloud-moon",
    "03n": "icon-cloud",
    "04n": "icon-clouds",
    "09n": "icon-drizzle",
    "10n": "icon-rain",
    "11n": "icon-cloud-flash",
    "13n": "icon-snow",
    "50n": "icon-fog",
  } as const;

  //ljs15708@noicd.com
  //const url = "http://api.openweathermap.org/data/2.5/forecast/city?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric";

  let remoteTemperature: {
    main: { temp: number };
    weather: { icon: string }[];
  };
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
      const iconEl =
        icon !== undefined ? <span className={"icon" + icon}></span> : "?";
      remote = (
        <span>
          {Math.round(remoteTemperature.main.temp)}°C{iconEl}
        </span>
      );
    }

    function deserialiseDate(timestamp?: string) {
      if (timestamp) {
        return new Date(timestamp);
      }
      return undefined;
    }

    function getLocalTemperature(
      temperature: number | undefined,
      timestamp: Date | undefined,
      maxAcceptableAgeMS: number
    ) {
      const error = checkAge(timestamp, maxAcceptableAgeMS);
      if (error === false) {
        if (temperature !== undefined) {
          if (!Number.isFinite(temperature)) {
            throw temperature + " is not a valid temperature";
          } else {
            return Math.round(temperature) + "°C";
          }
        } else {
          return errorSpan("no temperature");
        }
      } else {
        return errorSpan(error);
      }
    }
    // TODO: default to error not false
    const upHeating = getHomeData().upHeating?.status ?? false;
    const downHeating = getHomeData().downHeating?.status ?? false;
    const upTemperature =
      // I don't actually know how long it takes for purifier to send updates
      getLocalTemperature(
        getHomeData().purifier?.temperature,
        deserialiseDate(getHomeData().purifier?.timestamp),
        30 * 60 * 1000
      );
    const downTemperature = getLocalTemperature(
      getHomeData().temperature?.data,
      deserialiseDate(getHomeData().temperature?.timestamp),
      60 * 1000
    );
    return (
      <span style={{ display: "inline-block", margin: "0 50px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "60%",
            textAlign: "right",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                textAlign: "right",
                clear: "right",
                ...heatingStyle(upHeating),
              }}
            >
              {upTemperature}
            </span>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                marginRight: "80px",
                ...heatingStyle(downHeating),
              }}
            >
              {downTemperature}
            </span>
          </div>
        </span>{" "}
        | {remote}
      </span>
    );
  };
})();

function TvSocket({ data }: { data?: Socket }) {
  if (data != null && data.status != null) {
    const style = {
      ...heatingStyle(data.status),
      display: "inline-block",
      width: "30px",
      height: "30px",
      lineHeight: "30px",
      textAlign: "center",
    } as const;
    return <div style={style}>⏻</div>;
  }
  return null;
}

function Main() {
  function computeAqi() {
    return getHomeData().purifier?.aqi;
  }

  function computeTvSocket() {
    return getHomeData().tvSocket;
  }

  function computeTemperature() {
    return getTemperature();
  }

  function computeOctopus() {
    return getHomeData().octopus;
  }

  let [aqi, setAqi] = useState(computeAqi());
  let [tvSocket, setTvSocket] = useState(computeTvSocket());
  let [temperature, setTemperature] = useState(computeTemperature());
  let [octopus, setOctopus] = useState(computeOctopus());

  useEffect(() => {
    const interval = setInterval(function () {
      setAqi(computeAqi());
      setTvSocket(computeTvSocket());
      setTemperature(computeTemperature());
      setOctopus(computeOctopus());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="aqi">
        <Aqi aqi={aqi} />
      </div>
      <div>
        <Clock />
      </div>
      <div className="tvSocket">
        <TvSocket data={tvSocket} />
      </div>
      <div className="weather">{temperature}</div>
      <div className="octopus">
        <Octopus data={octopus} />
      </div>
      <div className="trains">
        <Tfl />
      </div>
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("contents"));

let fullscreen = false;
const noSleep = new nosleep();
document.onclick = function () {
  fullscreen = !fullscreen;
  if (fullscreen) {
    Screenfull.request();
    noSleep.enable();
  } else {
    Screenfull.exit();
    noSleep.disable();
  }
};
