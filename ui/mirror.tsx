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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {
        // A preferred amount of breathing room. It is a flex item rather than
        // padding so a long Tfl disruption consumes it before the page itself
        // overflows below the bezel.
      }
      <div style={{ height: "200px", flexShrink: 1 }} />
      <div style={{ flexShrink: 0 }}>
        {
          // Status strip: house power at one end, the car at the other. They
          // are pushed apart so the two energy readings can't be read as one
          // pair.
        }
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Octopus power={data.power} />
          <Car
            battery={data.teslaBattery}
            teslaChargeLimit={data.teslaChargeLimit}
            octopusChargeTarget={data.octopusChargeTarget}
            intelligentState={data.octopusIntelligentState}
            intelligentDispatching={data.octopusIntelligentDispatching}
          />
        </div>
        <Clock />
        <Weather
          upTemperature={data.upTemperature}
          downTemperature={data.downTemperature}
          outsideTemperature={data.outsideTemperature}
          weatherCondition={data.weatherCondition}
          sun={data.sun}
        />
      </div>
      <div style={{ display: "flow-root", marginTop: "auto", flexShrink: 0 }}>
        <Sonos device={data.kitchenMusic} />
        <Tfl />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("contents")!);
root.render(<Main />);
