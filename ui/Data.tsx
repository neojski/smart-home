import type { device } from "./Sonos";

export type Data = {
  sun?: string;
  power?: string;
  octopusIntelligentState?: string;
  octopusIntelligentDispatching?: string;
  upTemperature?: string;
  downTemperature?: string;
  outsideTemperature?: string;
  weatherCondition?: string;
  kitchenMusic?: device;
  teslaBattery?: string;
  teslaChargeLimit?: string;
  octopusChargeTarget?: string;
};
