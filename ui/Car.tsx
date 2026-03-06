import React from "react";

function isPluggedIn(state: string | undefined) {
  return (
    state === "SMART_CONTROL_CAPABLE" ||
    state === "SMART_CONTROL_IN_PROGRESS" ||
    state === "BOOSTING"
  );
}

function isCharging({
  intelligentState,
  intelligentDispatching,
}: {
  intelligentState: string | undefined;
  intelligentDispatching: string | undefined;
}) {
  return intelligentDispatching === "on" || intelligentState === "BOOSTING";
}

// https://claude.ai/chat/e399feab-5969-4470-960f-3e9c7b1f19f0
function BatteryDisplay({ level }: { level: number }) {
  // Clamp level between 0 and 100
  const clampedLevel = Math.max(0, Math.min(100, level));

  const batteryStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "60px",
    border: "6px solid white",
    borderRadius: "24px",
    overflow: "hidden",
  };

  const terminalStyle: React.CSSProperties = {
    position: "absolute",
    right: "-24px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "100%",
    backgroundColor: "white",
    borderRadius: "0 8px 8px 0",
  };

  const fillStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${clampedLevel}%`,
    backgroundColor: "white",
    transition: "width 0.3s ease-out",
  };

  const textContainerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textStyle: React.CSSProperties = {
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

export function Car({
  battery,
  intelligentState,
  intelligentDispatching,
}: {
  battery: string | undefined;
  intelligentState: string | undefined;
  intelligentDispatching: string | undefined;
}) {
  if (battery === undefined) return <></>;
  const showPlugTail = isPluggedIn(intelligentState);
  const showChargingBolt = isCharging({
    intelligentState,
    intelligentDispatching,
  });

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
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
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
          strokeWidth="1.4"
          style={{ verticalAlign: "middle", overflow: "visible" }}
        >
          <g>
            <g>
              <rect x="-22.6" y="6" width="8" height="13" rx="0.8" />
              <line x1="-18.6" y1="6" x2="-18.6" y2="4.8" />
              {showChargingBolt ? (
                <path
                  d="M-18.2 8.4 L-20 12.1 H-18.4 L-19.2 15.9 L-16.8 11.8 H-18.5 Z"
                  fill="currentColor"
                  stroke="none"
                />
              ) : null}
              {showPlugTail ? (
                <path
                  d="M5 14 C2 12 0 15 -4 14 C-7 13 -9 13 -12.3 13"
                  strokeLinecap="round"
                />
              ) : (
                <path d="M-12.3 13 L-11 13.8 L-11 18" strokeLinecap="round" />
              )}
              <rect x="-14.6" y="12" width="2.3" height="2.1" rx="0.4" />
            </g>
            {showPlugTail ? (
              <circle
                cx="5"
                cy="14"
                r="0.8"
                fill="currentColor"
                stroke="none"
              />
            ) : null}
          </g>
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
