import React from "react";
export function errorSpan(c: Error | string) {
  return <span className="error">{c.toString()}</span>;
}
