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
      <div style={{ height: "160px", flexShrink: 1 }} />
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
          flexShrink: 0,
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
      {
        // The clock and weather take all the slack and sit centred in it, so
        // the clock is spaced evenly between the strip above and Sonos below
        // rather than crowding the strip with the whole void beneath it.
        //
        // This is also where a Tfl disruption is absorbed: flex items floor at
        // their content height, so the group gives up its padding first, and
        // only then does the breathing room above the strip start to shrink.
      }
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Clock />
        <Weather
          upTemperature={data.upTemperature}
          downTemperature={data.downTemperature}
          outsideTemperature={data.outsideTemperature}
          weatherCondition={data.weatherCondition}
          sun={data.sun}
        />
      </div>
      <div style={{ display: "flow-root", flexShrink: 0 }}>
        <Sonos device={data.kitchenMusic} />
        <Tfl />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("contents")!);
root.render(<Main />);
