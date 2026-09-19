import { useEffect, useState } from "react";
import { pad } from "./pad";
import { initialError } from "./const";
import { errorSpan } from "./errorSpan";

import { getJSONData } from "./getJSONData";

// CR-someday: should I upload this to home assistant from server module?

// A Metropolitan line S8 car, drawn from published side elevations of LU
// stock: the cab front is a vertical face with only a small radius where the
// roof turns down, plus a chin cut back at the bottom. The real car is longer
// than this and has three double doors a side with a pair of windows between
// each; two doors is as much as stays legible at a stroke weight matching the
// car icon.
export function TubeTrain() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="164"
      height="90"
      viewBox="0 0 40 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Without this the flex row squashes the train to fit the status text.
      style={{ verticalAlign: "middle", flexShrink: 0 }}
    >
      {
        // Cab end on the right; the coupled end on the left is square.
      }
      <path d="M2.2 3.4 H35.4 A1.8 1.8 0 0 1 37.2 5.2 V12.6 L35.4 14.8 H2.2 A0.8 0.8 0 0 1 1.4 14 V4.2 A0.8 0.8 0 0 1 2.2 3.4 Z" />
      {
        // Doors are full-height panels, so they read as two plain edges.
      }
      <line x1="4" y1="3.4" x2="4" y2="14.8" />
      <line x1="8" y1="3.4" x2="8" y2="14.8" />
      <rect x="10.4" y="5.4" width="5" height="4.6" rx="0.8" />
      <line x1="17.8" y1="3.4" x2="17.8" y2="14.8" />
      <line x1="21.8" y1="3.4" x2="21.8" y2="14.8" />
      <rect x="24.2" y="5.4" width="5" height="4.6" rx="0.8" />
      <rect x="31.4" y="5" width="3.6" height="5.4" rx="1" />
      <circle cx="5.5" cy="18.6" r="2" />
      <circle cx="11.5" cy="18.6" r="2" />
      <circle cx="25" cy="18.6" r="2" />
      <circle cx="31" cy="18.6" r="2" />
      <line x1="0.5" y1="20.6" x2="39.5" y2="20.6" />
    </svg>
  );
}

function Status({ line }: { line: string }) {
  const url = "https://api.tfl.gov.uk/Line/" + line + "/Status";
  const linePrefix = new RegExp("^" + line + "\\s+line:\\s*", "i");

  let [status, setStatus] = useState<undefined | string[]>(undefined);

  async function update() {
    try {
      const datas = await getJSONData(url, false);
      // Tfl has duplicate disruption data so we dedup it using set
      let results: Set<string> = new Set();
      datas.forEach((data: any) => {
        data.lineStatuses.forEach((lineStatus: any) => {
          // statusSeverityDescription looks like:
          // Good Service
          // disruption looks like:
          // Metropolitan Line: Minor delays between Moor Park and Watford due to train cancellations. GOOD SERVICE on the rest of the line.
          const status = lineStatus.statusSeverityDescription;
          const disruption = lineStatus?.disruption?.description;
          if (disruption) {
            // The train says which line this is, so drop Tfl's leading
            // "Metropolitan Line: " and start on what actually happened.
            results.add(disruption.replace(linePrefix, ""));
          } else {
            results.add(status);
          }
        });
      });
      setStatus([...results]);
    } catch (e) {
      // CR-soon: better error handling?
      console.error(e);
      setStatus(undefined);
    }
  }

  useEffect(() => {
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <TubeTrain />
      <div>{status === undefined ? errorSpan() : status}</div>
    </div>
  );
}

export function Tfl() {
  // https://api.tfl.gov.uk/Line/metropolitan/StopPoints
  // Chalk Farm: 940GZZLUCFM
  // Belsize Park: 940GZZLUBZP
  // Amersham: 940GZZLUAMS
  // Liverpool Street: 940GZZLULVT
  // timetable: https://api.tfl.gov.uk/Line/metropolitan/Timetable/940GZZLUAMS/to/940GZZLULVT

  const url =
    "https://api.tfl.gov.uk/Line/metropolitan/Arrivals/940GZZLUAMS?app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804&direction=all";
  type vehicle = {
    timeToStation: number;
    vehicleId: string;
    platformName: string;
  };
  let previousData: vehicle[] | undefined;

  let [allVehicles, setAllVehicles] = useState(
    new Error(initialError) as vehicle[] | Error,
  );
  useEffect(() => {
    async function update() {
      try {
        const data = (await getJSONData(url, true)) as vehicle[];
        setAllVehicles(data);
      } catch (e) {
        setAllVehicles(new Error(String(e)));
      }
    }
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  function isNewVehicle(vehicle: vehicle) {
    return (
      previousData &&
      !(
        previousData.findIndex((vehicle2) => {
          return vehicle2.vehicleId === vehicle.vehicleId;
        }) > -1
      )
    );
  }
  if (allVehicles instanceof Error) {
    return <div>{errorSpan(allVehicles)}</div>;
  }

  let vehicles = allVehicles.filter((x) => {
    return x.platformName.indexOf("Southbound") > -1;
  });

  return (
    <div style={{ margin: "40px", fontSize: "40px" }}>
      <div>
        <Status line="metropolitan" />
      </div>
      <div style={{ display: "none" }}>
        Amersham Station: {vehicles.length === 0 ? "no trains" : ""}
        <ul style={{ position: "relative" }}>
          {vehicles
            .sort((x, y) => {
              return x.timeToStation - y.timeToStation;
            })
            .map((x, i) => {
              const time = x.timeToStation;
              const text = Math.floor(time / 60) + ":" + pad(time % 60);
              const width = time / 60 + "cm";
              const transition = { transition: "1s" };
              const whiteText = <div style={{ color: "#fff" }}>{text}</div>;
              const blackText = (
                <div
                  style={{
                    color: "#000",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    background: "#fff",
                    width: width,
                    overflow: "hidden",
                    borderRadius: "3px",
                    ...transition,
                  }}
                >
                  {text}
                </div>
              );
              const top = (() => {
                if (isNewVehicle(x)) {
                  return window.screen.height + "px";
                } else {
                  return i * 58 + "px";
                }
              })();
              return (
                <li
                  key={x.vehicleId}
                  style={{
                    position: "absolute",
                    top: top,
                    whiteSpace: "nowrap",
                    margin: "0 0 10px",
                    ...transition,
                  }}
                >
                  {whiteText}
                  {blackText}
                </li>
              );
            })}
        </ul>{" "}
      </div>
    </div>
  );
}
