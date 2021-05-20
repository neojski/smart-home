import React from "react";
import { Socket } from "../shared/Socket";
import { heatingStyle } from "./heatingStyle";
export function TvSocket({ data }: { data?: Socket }) {
  if (data != null && data.status != null) {
    const style = {
      ...heatingStyle(data.status),
      display: "inline-block",
      width: "30px",
      height: "30px",
      lineHeight: "30px",
      textAlign: "center",
    } as const;
    return <div style={style}>⏻</div>;
  }
  return null;
}
