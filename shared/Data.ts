import { Purifier } from "./Purifier";
import { Temperature } from "./Temperature";
import { Socket } from "./Socket";
import { Octopus } from "./Octopus";

export interface Data {
  tvSocket?: Socket;
  purifier?: Purifier;
  upHeating?: Socket;
  downHeating?: Socket;
  temperature?: Temperature;
  octopus?: Octopus; // TODO: it's unfortunate that this data may be missing due to silly tech reasons in main
}
