import { temperatureWithIcon } from "./Weather";

export type Data = {
  aqi?: string;
  power?: string;
  upTemperature?: string;
  downTemperature?: string;
  weather?: temperatureWithIcon;
};
