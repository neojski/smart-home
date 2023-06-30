import React from "react";
import { errorSpan } from "./errorSpan";
import { remoteTemperature } from "./mirror";

export function RemoteTemperature({
  remoteTemperature,
}: {
  remoteTemperature: remoteTemperature | string;
}) {
  const iconMap = {
    "01d": "icon-sun",
    "02d": "icon-cloud-sun",
    "03d": "icon-cloud",
    "04d": "icon-clouds",
    "09d": "icon-drizzle",
    "10d": "icon-rain",
    "11d": "icon-cloud-flash",
    "13d": "icon-snow",
    "50d": "icon-fog",
    "01n": "icon-moon",
    "02n": "icon-cloud-moon",
    "03n": "icon-cloud",
    "04n": "icon-clouds",
    "09n": "icon-drizzle",
    "10n": "icon-rain",
    "11n": "icon-cloud-flash",
    "13n": "icon-snow",
    "50n": "icon-fog",
  } as const;

  if (typeof remoteTemperature === "string") {
    return errorSpan(remoteTemperature);
  } else {
    const iconKey = remoteTemperature.weather[0].icon;
    const icon = (iconMap as { [x: string]: string | undefined })[iconKey];
    const iconEl =
      icon !== undefined ? <span className={"icon" + icon}></span> : "?";
    return (
      <span>
        {Math.round(remoteTemperature.main.temp)}°C{iconEl}
      </span>
    );
  }
}
