import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import { RemoteTemperature } from "./RemoteTemperature";

export const initialError = "↻";

export type remoteTemperature = {
  main: { temp: number };
  weather: { icon: string }[];
};

function Main() {
  type Data = {
    aqi: number | undefined;
    power: number | undefined;
    upTemperature: number | undefined;
    downTemperature: number | undefined;
    weather: remoteTemperature | string;
  };
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      // CR: actually read websockets
      //
      // For weather also do home assistant, maybe both ldn + amersham? App_id: 5dd85d48cb8bb2c9cc6e656e359bc1b2
      setData({
        aqi: 999,
        power: 999,
        upTemperature: 999,
        downTemperature: 999,
        weather: { main: { temp: 999 }, weather: [{ icon: "01d" }] },
      });
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
            | <RemoteTemperature remoteTemperature={data.weather} />
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

ReactDOM.render(<Main />, document.getElementById("contents"));
