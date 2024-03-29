import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import HomeAssistant from "./homeAssistant";
import { Data } from "./Data";
import { Weather } from "./Weather";
import { Sonos } from "./Sonos";

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

ReactDOM.render(<Main />, document.getElementById("contents"));
