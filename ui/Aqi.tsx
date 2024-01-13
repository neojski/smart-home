import React from "react";
export function Aqi({ aqi }: { aqi: string | undefined }) {
  let content;
  if (aqi === "unavailable" || aqi === undefined) {
    content = <div>&nbsp;</div>;
  } else {
    content = (
      <div>
        {Math.round(+aqi)}
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
  return (
    <div
      style={{
        margin: "300px 0 0 700px",
        textAlign: "center",
        fontSize: "100px",
      }}
    >
      {content}
    </div>
  );
}
