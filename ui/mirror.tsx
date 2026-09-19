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
    // Breathing room at the top, so the strip isn't jammed against the bezel.
    // Bounded by the Tfl block at the bottom: a disruption renders four lines
    // there, and html sets `overflow: hidden`, so anything past 1280px is lost
    // silently. 200px is about the most that still fits on a disruption day.
    <div style={{ paddingTop: "200px" }}>
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
      <Sonos device={data.kitchenMusic} />
      <Tfl />
    </div>
  );
}

const root = createRoot(document.getElementById("contents")!);
root.render(<Main />);
