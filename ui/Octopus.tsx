import React from "react";
import { errorSpan } from "./errorSpan";

// TODO: check freshness of this data?
export function Octopus({ power }: { power: number | undefined }) {
  const content = power === undefined ? errorSpan() : "" + Math.round(power);
  return (
    <div style={{ margin: "40px", fontSize: "80px", textAlign: "center" }}>
      ⚡{content}W
    </div>
  );
}
