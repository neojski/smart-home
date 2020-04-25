import React from "react";
import { errorSpan } from "./errorSpan";
export function Aqi({ aqi }: { aqi: number | undefined }) {
  let local;
  if (aqi !== undefined) {
    local = Math.round(aqi);
  } else {
    local = errorSpan("purifier undefined");
  }
  return (
    <div>
      {local}
      <span className="pm25">PM2.5</span>
    </div>
  );
}
