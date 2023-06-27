import { Purifier } from "./Purifier";
import { Temperature } from "./Temperature";
import { Socket } from "./Socket";
import { Octopus } from "./Octopus";

export interface Data {
  tvSocket: Socket;
  purifier: Purifier;
  upHeating: Socket;
  downHeating: Socket;
  temperature: Temperature;
  octopus: Octopus;
}
