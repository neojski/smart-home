declare module "miio" {
  interface TemperatureChanged {
    value: number;
  }

  type Pm2_5Changed = number;

  type RelativeHumidityChanged = number;

  type mode = "auto" | "silent";

  class Device {
    setMode(mode: mode): Promise<void>;
    setBuzzer(arg0: boolean): void;
    on(
      name: "temperatureChanged",
      callback: { (v: TemperatureChanged): void }
    ): void;
    on(name: "pm2.5Changed", callback: { (v: Pm2_5Changed): void }): void;
    on(
      name: "relativeHumidityChanged",
      callback: { (v: RelativeHumidityChanged): void }
    ): void;
  }

  export default class {
    static device: {
      (opts: { address: string; retries: number }): Promise<Device>;
    };
  }
}
