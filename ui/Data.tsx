import { device } from "./Sonos";

export type Data = {
  mail?: string;
  sun?: string;
  aqi?: string;
  power?: string;
  upTemperature?: string;
  downTemperature?: string;
  outsideTemperature?: string;
  weatherIcon?: string;
  kitchenMusic?: device;
};
