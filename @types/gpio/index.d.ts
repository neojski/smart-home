declare module "gpio" {
  export class Gpio {
    set: { (value: string): void };
    value: string;
  }

  export default class {
    static export: {
      (pin: string, x: { direction: string; ready: () => void }): Gpio;
    };
  }
}
