import { errorSpan } from "./errorSpan";
import { parseCondition, weatherIconClass } from "./weatherIcons";

export function WeatherIcon({
  condition,
  sun,
}: {
  condition: string | undefined;
  sun: string | undefined;
}) {
  const parsed = parseCondition(condition);
  if (parsed === undefined) {
    if (condition !== undefined) {
      // Not merely missing (it is undefined until the first state arrives):
      // unavailable, or a condition Home Assistant has added since. The
      // mirror shows the usual error glyph either way, so say which it was.
      console.warn("no icon for weather condition", condition);
    }
    return errorSpan();
  }
  return (
    <i
      className={`wi ${weatherIconClass(parsed, sun)}`}
      style={{ fontSize: "0.8em", verticalAlign: "-0.05em" }}
    />
  );
}

export function Weather({
  upTemperature,
  downTemperature,
  outsideTemperature,
  weatherCondition,
  sun,
}: {
  upTemperature: string | undefined;
  downTemperature: string | undefined;
  outsideTemperature: string | undefined;
  weatherCondition: string | undefined;
  sun: string | undefined;
}) {
  function roundOrError(x: string | undefined) {
    if (x === undefined) {
      return errorSpan();
    }
    return Math.round(+x) + "°C";
  }
  let upTemperatureContent = roundOrError(upTemperature);
  let downTemperatureContent = roundOrError(downTemperature);
  let outsideTemperatureContent = roundOrError(outsideTemperature);
  return (
    <div
      style={{
        fontSize: "112px",
        fontWeight: 300,
        textAlign: "center",
      }}
    >
      <span style={{ display: "inline-block", margin: "0 40px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "60%",
            textAlign: "right",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                textAlign: "right",
                clear: "right",
              }}
            >
              {upTemperatureContent}
            </span>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                marginRight: "64px",
              }}
            >
              {downTemperatureContent}
            </span>
          </div>
        </span>{" "}
        | {outsideTemperatureContent}{" "}
        <WeatherIcon condition={weatherCondition} sun={sun} />
      </span>
    </div>
  );
}
