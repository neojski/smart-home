import React from "react";

export interface device {
  attributes?: {
    media_title?: string;
    media_artist?: string;
  };
  state: string;
}

export function Sonos({ device }: { device?: device }) {
  console.log(device);
  if (device === undefined) {
    return null;
  }
  if (
    device.state !== "playing" ||
    device.attributes?.media_artist === undefined ||
    device.attributes?.media_title === undefined
  ) {
    return null;
  }
  return (
    <div style={{ margin: "40px", fontSize: "40px" }}>
      Playing: {device.attributes.media_title} by{" "}
      {device.attributes.media_artist}
    </div>
  );
}
