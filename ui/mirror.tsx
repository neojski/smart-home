import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { errorSpan } from "./errorSpan";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";

export const initialError = "↻";

type remoteTemperature = {
  main: { temp: number };
  weather: { icon: string }[];
};

function RemoteTemperature({
  remoteTemperature,
}: {
  remoteTemperature: remoteTemperature | string;
}) {
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

  if (typeof remoteTemperature === "string") {
    return errorSpan(remoteTemperature);
  } else {
    const iconKey = remoteTemperature.weather[0].icon;
    const icon = (iconMap as { [x: string]: string | undefined })[iconKey];
    const iconEl =
      icon !== undefined ? <span className={"icon" + icon}></span> : "?";
    return (
      <span>
        {Math.round(remoteTemperature.main.temp)}°C{iconEl}
      </span>
    );
  }
}

function Wrapper() {
  type Data = {
    aqi: number | undefined;
    power: number | undefined;
    upTemperature: number | undefined;
    downTemperature: number | undefined;
  };
  const [data, setData] = useState<Data | undefined>(undefined);
  const [remoteTemperature, setRemoteTemperature] = useState<
    remoteTemperature | string
  >(initialError);

  useEffect(() => {
    const interval = setInterval(() => {
      // CR: actually read websockets
      setData({
        aqi: 999,
        power: 999,
        upTemperature: 999,
        downTemperature: 999,
      });

      // CR: fix this

      //ljs15708@noicd.com
      //const url = "http://api.openweathermap.org/data/2.5/forecast/city?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2";
      //const url =
      //  "https://api.openweathermap.org/data/2.5/weather?id=2643743&APPID=5dd85d48cb8bb2c9cc6e656e359bc1b2&units=metric";
      //
      //updater(url, function (err, result) {
      //  if (err) {
      //    setRemoteTemperature(err);
      //  } else {
      //    setRemoteTemperature(result);
      //  }
      //});
      setRemoteTemperature({ main: { temp: 999 }, weather: [{ icon: "01d" }] });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (data) {
    return (
      <div>
        <div className="aqi">
          <Aqi aqi={data.aqi} />
        </div>
        <div>
          <Clock />
        </div>
        <div className="weather">
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
                  }}
                >
                  {data.upTemperature}
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: "inline-block",
                    marginRight: "80px",
                  }}
                >
                  {data.downTemperature}
                </span>
              </div>
            </span>{" "}
            | <RemoteTemperature remoteTemperature={remoteTemperature} />
          </span>
        </div>
        <div className="octopus">
          <Octopus power={data.power} />
        </div>
        <div className="trains">
          <Tfl />
        </div>
      </div>
    );
  } else {
    return <div>Waiting for data</div>;
  }
}

ReactDOM.render(<Wrapper />, document.getElementById("contents"));

////////
////////
////////
////////
////////
////////

// Configuration
const HA_WS_API_URL = "ws://192.168.1.232:8123/api/websocket";
const HA_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiM2IxYzI1ZmViOGI0YzE5OTM2ZDYyZWQwM2E4OTNmYyIsImlhdCI6MTY4ODE1NzA5NywiZXhwIjoyMDAzNTE3MDk3fQ.O6sL-X2bB7ztsEitEhkGtzW6z-O_f75JlVee8dUDq24";

// Connect to Home Assistant WebSocket API
const socket = new WebSocket(HA_WS_API_URL);

socket.addEventListener("open", () => {
  console.log("Connected to Home Assistant WebSocket API");

  // Authenticate with Home Assistant
  socket.send(JSON.stringify({ type: "auth", access_token: HA_ACCESS_TOKEN }));
});

socket.addEventListener("message", (event: any) => {
  const message = JSON.parse(event.data);

  if (message.type === "auth_ok") {
    console.log("Authentication successful");

    socket.send(JSON.stringify({ id: 1, type: "subscribe_events" }));
  }

  console.log(event);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Home Assistant WebSocket API");
});

socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});
