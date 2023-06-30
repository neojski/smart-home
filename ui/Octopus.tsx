import React from "react";
import { errorSpan } from "./errorSpan";
import { assertUnreachable } from "./assertUnreachable";

// TODO: check freshness of this data?
export function Octopus({ power }: { power: number | undefined }) {
  let contents;
  if (power === undefined) {
    contents = errorSpan("no data");
  } else if (typeof power === "number") {
    contents = "⚡" + power + "W";
  } else {
    assertUnreachable(power);
  }
  return (
    <div style={{ margin: "40px", fontSize: "80px", textAlign: "center" }}>
      {contents}
    </div>
  );
}
