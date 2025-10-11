import React from "react";

// https://claude.ai/chat/e399feab-5969-4470-960f-3e9c7b1f19f0
function BatteryDisplay({ level }: { level: number }) {
  // Clamp level between 0 and 100
  const clampedLevel = Math.max(0, Math.min(100, level));

  const batteryStyle = {
    position: "relative",
    width: "100%",
    height: "60px",
    border: "6px solid white",
    borderRadius: "24px",
    overflow: "hidden",
  };

  const terminalStyle = {
    position: "absolute",
    right: "-24px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "100%",
    backgroundColor: "white",
    borderRadius: "0 8px 8px 0",
  };

  const fillStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${clampedLevel}%`,
    backgroundColor: "white",
    transition: "width 0.3s ease-out",
  };

  const textContainerStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle = {
    fontSize: "40px",
    fontWeight: "bold",
    color: "white",
    mixBlendMode: "difference",
  };

  return (
    <div style={batteryStyle}>
      <div style={terminalStyle}></div>
      <div style={fillStyle}></div>
      <div style={textContainerStyle}>
        <div style={textStyle}>{Math.round(clampedLevel)}%</div>
      </div>
    </div>
  );
}

export function Car({ battery }: { battery: string | undefined }) {
  if (battery === undefined) return <></>;

  return (
    <div
      style={{
        textAlign: "right",
        fontSize: "50px",
        marginRight: "80px",
        display: "flex",
        gap: "20px",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div>
        {
          // https://tabler.io/icons/icon/car
        }
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="110"
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
      </div>
      <div style={{ width: "160px" }}>
        <BatteryDisplay level={+battery} />
      </div>
    </div>
  );
}
