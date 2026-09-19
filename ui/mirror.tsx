import { useState, useEffect } from "react";
import { Clock } from "./Clock";
import { Tfl } from "./Tfl";
import { Octopus } from "./Octopus";
import HomeAssistant from "./homeAssistant";
import type { Data } from "./Data";
import { Weather } from "./Weather";
import { Sonos } from "./Sonos";
import { createRoot } from "react-dom/client";
import { Car } from "./Car";

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
      <Car
        battery={data.teslaBattery}
        teslaChargeLimit={data.teslaChargeLimit}
        octopusChargeTarget={data.octopusChargeTarget}
        intelligentState={data.octopusIntelligentState}
        intelligentDispatching={data.octopusIntelligentDispatching}
      />
      <Clock />
      <Weather
        upTemperature={data.upTemperature}
        downTemperature={data.downTemperature}
        outsideTemperature={data.outsideTemperature}
        weatherCondition={data.weatherCondition}
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
