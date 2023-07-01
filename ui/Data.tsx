import { remoteTemperature } from "./RemoteTemperature";

export type Data = {
  aqi: number | undefined;
  power: number | undefined;
  upTemperature: number | undefined;
  downTemperature: number | undefined;
  weather: remoteTemperature | undefined;
};
