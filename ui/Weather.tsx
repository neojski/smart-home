import React from "react";
import { errorSpan } from "./errorSpan";

export type temperatureWithIcon = {
  temp?: string;
  icon?: string;
};

export function WeatherIcon({ icon }: { icon: string | undefined }) {
  if (icon === undefined) {
    return errorSpan();
  } else {
    const iconId = "wi wi-owm-" + icon;
    return <i className={iconId}></i>;
  }
}

export function Weather({
  upTemperature,
  downTemperature,
  outsideTemperature,
  weatherIcon,
}: {
  upTemperature: string | undefined;
  downTemperature: string | undefined;
  outsideTemperature: string | undefined;
  weatherIcon: string | undefined;
}) {
  function roundOrError(x: string | undefined) {
    if (x === undefined) {
      return errorSpan();
    }
    return Math.round(+x) + "°C";
  }
  let upTemperatureContent = roundOrError(upTemperature);
  let downTemperatureContent = roundOrError(downTemperature);
  let outsideTemperatureContent = roundOrError(outsideTemperature);
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
        | {outsideTemperatureContent} <WeatherIcon icon={weatherIcon} />
      </span>
    </div>
  );
}
