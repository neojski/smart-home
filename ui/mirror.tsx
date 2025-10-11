import React, { useState, useEffect } from "react";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import HomeAssistant from "./homeAssistant";
import { Data } from "./Data";
import { Weather } from "./Weather";
import { Sonos } from "./Sonos";
import { createRoot } from "react-dom/client";
import { Mail } from "./Mail";

export function Main() {
  const [data, setData] = useState<Data>({});

  useEffect(() => {
    const homeAssistant = new HomeAssistant(setData);
    return () => {
      homeAssistant.destroy();
    };
  }, []);

  return (
    <div>
      <Mail mail={data.mail} />
      <div
        style={{ textAlign: "right", fontSize: "50px", marginRight: "80px" }}
      >
        {
          // https://tabler.io/icons/icon/car
        }
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ verticalAlign: "middle" }}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
        </svg>
        <span style={{ verticalAlign: "middle", fontWeight: 600 }}>
          {data.teslaBattery}%
        </span>
      </div>
      <Aqi aqi={data.aqi} />
      <Clock />
      <Weather
        upTemperature={data.upTemperature}
        downTemperature={data.downTemperature}
        outsideTemperature={data.outsideTemperature}
        weatherIcon={data.weatherIcon}
        sun={data.sun}
      />
      <Octopus power={data.power} />
      <Sonos device={data.kitchenMusic} />
      <Tfl />
    </div>
  );
}

const root = createRoot(document.getElementById("contents")!);
root.render(<Main />);
