import type { device } from "./Sonos";

export type Data = {
  mail?: string;
  sun?: string;
  aqi?: string;
  power?: string;
  octopusIntelligentState?: string;
  octopusIntelligentDispatching?: string;
  upTemperature?: string;
  downTemperature?: string;
  outsideTemperature?: string;
  weatherIcon?: string;
  kitchenMusic?: device;
  teslaBattery?: string;
  teslaChargeLimit?: string;
  octopusChargeTarget?: string;
};
