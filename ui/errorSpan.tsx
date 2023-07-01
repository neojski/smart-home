import React from "react";
import { initialError } from "./const";

export function errorSpan(c: Error | string = initialError) {
  return <span className="error">{c.toString()}</span>;
}
