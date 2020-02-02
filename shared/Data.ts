import { Purifier } from "./Purifier";
import { Temperature } from "./Temperature";
import { Socket } from "./Socket";

export interface Data {
  tvSocket?: Socket;
  purifier?: Purifier;
  upHeating?: Socket;
  downHeating?: Socket;
  temperature?: Temperature;
}
