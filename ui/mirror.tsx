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
    // Full-height column: the strip, clock and weather sit under a fixed top
    // margin, and Sonos + Tfl are pushed to the bottom edge by the auto margin
    // below. All the slack therefore collects in one gap, between the weather
    // and Sonos, instead of pooling uselessly under the train.
    //
    // This also absorbs growth: a disruption renders four lines instead of one,
    // and the bottom group expands upward into that gap rather than off the
    // screen. html sets `overflow: hidden`, so anything past the viewport is
    // lost silently -- the gap is the buffer that keeps that from happening.
    //
    // border-box matters: without it the 200px padding would be added to 100vh
    // and push the train off the bottom on every render.
    <div
      style={{
        boxSizing: "border-box",
        minHeight: "100vh",
        paddingTop: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        // Status strip: house power at one end, the car at the other. They are
        // pushed apart so the two energy readings can't be read as one pair.
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
      <div style={{ marginTop: "auto" }}>
        <Sonos device={data.kitchenMusic} />
        <Tfl />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("contents")!);
root.render(<Main />);
