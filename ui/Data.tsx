import { remoteTemperature } from "./mirror";

export type Data = {
  aqi: number | undefined;
  power: number | undefined;
  upTemperature: number | undefined;
  downTemperature: number | undefined;
  weather: remoteTemperature | string;
};
