import React, { useEffect, useState } from "react";
import { pad } from "./pad";
import { initialError } from "./const";
import { errorSpan } from "./errorSpan";

import { getJSONData } from "./getJSONData";

// CR-someday: should I upload this to home assistant from server module?

function Status({ line }: { line: string }) {
  const url = "https://api.tfl.gov.uk/Line/" + line + "/Status";

  let [status, setStatus] = useState<undefined | string[]>(undefined);

  async function update() {
    console.log("update");
    try {
      const datas = await getJSONData(url, false);
      let results: string[] = [];
      datas.forEach((data: any) => {
        data.lineStatuses.forEach((lineStatus: any) => {
          // statusSeverityDescription looks like:
          // Good Service
          // disruption looks like:
          // Metropolitan Line: Minor delays between Moor Park and Watford due to train cancellations. GOOD SERVICE on the rest of the line.
          const status = lineStatus.statusSeverityDescription;
          const disruption = lineStatus?.disruption?.description;
          if (disruption) {
            results.push(disruption);
          } else {
            results.push(status);
          }
        });
      });
      setStatus(results);
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
    <div>
      {line} line:
      <div style={{ marginLeft: "50px" }}>
        {status === undefined ? errorSpan() : status}
      </div>
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
    new Error(initialError) as vehicle[] | Error
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
