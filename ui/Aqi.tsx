import React from "react";
import { errorSpan } from "./errorSpan";
export function Aqi({ aqi }: { aqi: string | undefined }) {
  let content;
  if (aqi !== undefined) {
    content = Math.round(+aqi);
  } else {
    content = errorSpan();
  }
  return (
    <div
      style={{
        margin: "300px 0 0 700px",
        textAlign: "center",
        fontSize: "100px",
      }}
    >
      {content}
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
