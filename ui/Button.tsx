import React from "react";
import { errorSpan } from "./errorSpan";

export function Button({ data }: { data: string | undefined }) {
  let content = data ? data : errorSpan();
  return <div style={{ textAlign: "center", fontSize: "20px" }}>{content}</div>;
}
