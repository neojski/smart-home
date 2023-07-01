import React from "react";
import { errorSpan } from "./errorSpan";

export type temperatureWithIcon = {
  temp?: number;
  icon?: number;
};

export function TemperatureWithIcon({
  remoteTemperature,
}: {
  remoteTemperature: temperatureWithIcon | undefined;
}) {
  if (remoteTemperature === undefined) {
    return errorSpan();
  } else {
    const iconId = "wi wi-owm-" + remoteTemperature.icon;
    const iconEl = <i className={iconId}></i>;
    let temp = "?";
    if (remoteTemperature.temp !== undefined) {
      temp = "" + Math.round(remoteTemperature.temp);
    }
    return (
      <span>
        {temp}°C {iconEl}
      </span>
    );
  }
}

export function Weather({
  upTemperature,
  downTemperature,
  weather,
}: {
  upTemperature: number | undefined;
  downTemperature: number | undefined;
  weather: temperatureWithIcon | undefined;
}) {
  let upTemperatureContent = upTemperature ?? errorSpan();
  let downTemperatureContent = downTemperature ?? errorSpan();
  return (
    <div
      style={{
        fontSize: "140px",
        fontWeight: 300,
        textAlign: "center",
      }}
    >
      <span style={{ display: "inline-block", margin: "0 50px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "60%",
            textAlign: "right",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                textAlign: "right",
                clear: "right",
              }}
            >
              {upTemperatureContent}
            </span>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                marginRight: "80px",
              }}
            >
              {downTemperatureContent}
            </span>
          </div>
        </span>{" "}
        | <TemperatureWithIcon remoteTemperature={weather} />
      </span>
    </div>
  );
}
