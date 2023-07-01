import { temperatureWithIcon } from "./Weather";

export type Data = {
  aqi?: number;
  power?: number;
  upTemperature?: number;
  downTemperature?: number;
  weather?: temperatureWithIcon;
};
