import { errorSpan } from "./errorSpan";

// Whole-house grid draw, sitting at the left end of the status strip opposite
// the car. Deliberately no ⚡ prefix: the only bolt on the mirror is the one
// inside the car's plug icon, which means "the car is charging". A second one
// here would read as the car's charge rate rather than the house total.
export function Octopus({ power }: { power: string | undefined }) {
  const content = power === undefined ? errorSpan() : "" + Math.round(+power);
  return <div style={{ marginLeft: "64px", fontSize: "40px" }}>{content}W</div>;
}
