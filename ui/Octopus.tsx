import React from "react";
import { errorSpan } from "./errorSpan";
import { Octopus } from "../shared/Octopus";

function assertUnreachable(_value: never): never {
  throw new Error("Statement should be unreachable");
}

// TODO: check freshness of this data?
// This isn't very principled as this component reads data from server but whatever.
export function Octopus({ data }: { data?: Octopus }) {
  if (!data) {
    return <div>Data missing</div>;
  }
  let power;
  if (data.power === undefined) {
    power = new Error("Waiting for data");
  } else if (typeof data.power === "number") {
    power = "⚡" + data.power + "W";
  } else if (typeof data.power === "string") {
    power = new Error(String(data.power));
  } else {
    assertUnreachable(data.power);
  }
  return (
    <div style={{ margin: "40px", fontSize: "80px", textAlign: "center" }}>
      {power instanceof Error ? errorSpan(power) : power}
    </div>
  );
}
