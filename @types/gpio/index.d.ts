declare module 'gpio' {
  export class Gpio {
    set: { (value: boolean): void };
    value: boolean;
  }

  export default class {
    static export: { (pin: number, x: { direction: string; ready: () => void; }): Gpio }
  }
}