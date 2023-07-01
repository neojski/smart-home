import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Clock } from "./Clock";
import { Aqi } from "./Aqi";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import HomeAssistant from "./homeAssistant";
import { Data } from "./Data";
import { Weather } from "./Weather";

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
        <div className="aqi">
          <Aqi aqi={data.aqi} />
        </div>
        <div>
          <Clock />
        </div>
        <div>{Weather(data)}</div>
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
