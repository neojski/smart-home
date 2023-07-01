import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import HomeAssistant from "./homeAssistant";
import { Data } from "./Data";
import { Weather } from "./Weather";
import { errorSpan } from "./errorSpan";

export function Main() {
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    const homeAssistant = new HomeAssistant(setData);
    return () => {
      homeAssistant.destroy();
    };
  }, []);

  if (data) {
    return (
      <div>
        <Aqi aqi={data.aqi} />
        <Clock />
        <Weather
          upTemperature={data.upTemperature}
          downTemperature={data.downTemperature}
          weather={data.weather}
        />
        <Octopus power={data.power} />
        <Tfl />
      </div>
    );
  } else {
    return errorSpan();
  }
}

ReactDOM.render(<Main />, document.getElementById("contents"));
