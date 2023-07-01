import React from "react";
import { errorSpan } from "./errorSpan";
export function Aqi({ aqi }: { aqi: number | undefined }) {
  let local;
  if (aqi !== undefined) {
    local = Math.round(aqi);
  } else {
    local = errorSpan();
  }

  return (
    <div>
      {local}
      <span
        style={{
          fontSize: "16px",
          transform: "translate(16px, 0px) rotate(-90deg)",
          display: "inline-block",
          transformOrigin: "bottom left",
        }}
      >
        PM2.5
      </span>
    </div>
  );
}
