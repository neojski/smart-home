import { temperatureWithIcon } from "./Weather";

export type Data = {
  aqi: number | undefined;
  power: number | undefined;
  upTemperature: number | undefined;
  downTemperature: number | undefined;
  weather: temperatureWithIcon | undefined;
};
