import React from "react";

export function Car({ battery }: { battery: string | undefined }) {
  if (battery === undefined) return <></>;

  return (
    <div style={{ textAlign: "right", fontSize: "50px", marginRight: "80px" }}>
      {
        // https://tabler.io/icons/icon/car
      }
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        style={{ verticalAlign: "middle" }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
      </svg>
      <span style={{ verticalAlign: "middle", fontWeight: 600 }}>
        {battery}%
      </span>
    </div>
  );
}
