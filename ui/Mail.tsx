import React from "react";
import { errorSpan } from "./errorSpan";

export function Mail({ mail }: { mail: string | undefined }) {
  const content = mail === undefined ? errorSpan() : '✉️';

  let visibility: 'visible' | 'hidden' = 'visible';
  if (mail === 'off') {
    visibility = 'hidden';
  }

  return (
    <div style={{
      marginTop: "200px", fontSize: "200px", textAlign: "center", visibility: visibility
    }
    }>
      {content}
    </div >
  );
}
