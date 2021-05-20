import React, { useState, useEffect } from "react";
import { pad } from "./pad";
export function Clock() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setDate(date);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      style={{
        fontSize: "300px",
        fontWeight: 300,
        textAlign: "center",
      }}
    >
      {pad(date.getHours())}
      <span
        style={{
          visibility: date.getSeconds() % 2 === 0 ? "hidden" : "visible",
        }}
      >
        :
      </span>
      {pad(date.getMinutes())}
      <span
        style={{
          fontSize: "30%",
          display: "inline-block",
          transform: "translate(0, -30px) rotate(-90deg)",
        }}
      >
        {pad(date.getSeconds())}
      </span>
    </div>
  );
}
