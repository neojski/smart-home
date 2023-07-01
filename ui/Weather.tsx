import React from "react";
import { RemoteTemperature } from "./RemoteTemperature";
import { Data } from "./Data";

export function Weather(data: Data) {
  return (
    <div className="weather">
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
              {data.upTemperature}
            </span>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                marginRight: "80px",
              }}
            >
              {data.downTemperature}
            </span>
          </div>
        </span>{" "}
        | <RemoteTemperature remoteTemperature={data.weather} />
      </span>
    </div>
  );
}
