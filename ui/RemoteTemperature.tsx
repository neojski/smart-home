import React from "react";
import { errorSpan } from "./errorSpan";

export type remoteTemperature = {
  temp?: number;
  icon?: number;
};

export function RemoteTemperature({
  remoteTemperature,
}: {
  remoteTemperature: remoteTemperature | undefined;
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
