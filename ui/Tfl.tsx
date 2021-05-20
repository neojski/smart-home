import React, { useEffect, useState } from "react";
import { pad } from "./pad";
import { initialError } from "./mirror";
import { errorSpan } from "./errorSpan";

import { getJSONData } from "./getJSONData";

export function Tfl() {
  // Chalk Farm: 940GZZLUCFM
  // Belsize Park: 940GZZLUBZP

  const url =
    "https://api.tfl.gov.uk/Line/northern/Arrivals/940GZZLUBZP?direction=inbound&app_id=8268063a&app_key=14f7f5ff5d64df2e88701cef2049c804";
  type vehicle = {
    timeToStation: number;
    towards: string;
    vehicleId: string;
  };
  let previousData: vehicle[] | undefined;

  let [allVehicles, setAllVehicles] = useState(
    new Error(initialError) as vehicle[] | Error
  );
  useEffect(() => {
    async function update() {
      try {
        const data = (await getJSONData(url)) as vehicle[];
        setAllVehicles(data);
      } catch (e) {
        setAllVehicles(new Error(e.toString()));
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
    return x.towards.indexOf("Bank") > -1;
  });

  return (
    <div style={{ margin: "40px" }}>
      Morden via Bank: {vehicles.length === 0 ? "no trains" : ""}
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
      </ul>
    </div>
  );
}
