import React from "react";
import { RemoteTemperature, remoteTemperature } from "./RemoteTemperature";

export function Weather({
  upTemperature,
  downTemperature,
  weather,
}: {
  upTemperature: number | undefined;
  downTemperature: number | undefined;
  weather: remoteTemperature | undefined;
}) {
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
              {upTemperature}
            </span>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                marginRight: "80px",
              }}
            >
              {downTemperature}
            </span>
          </div>
        </span>{" "}
        | <RemoteTemperature remoteTemperature={weather} />
      </span>
    </div>
  );
}
