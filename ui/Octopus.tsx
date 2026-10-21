import { errorSpan } from "./errorSpan";

// Whole-house grid draw, sitting at the left end of the status strip opposite
// the car. Deliberately no ⚡ prefix: the only bolt on the mirror is the one
// inside the car's plug icon, which means "the car is charging". A second one
// here would read as the car's charge rate rather than the house total.
export function Octopus({ power }: { power: string | undefined }) {
  const content = power === undefined ? errorSpan() : "" + Math.round(+power);
  // Sized to hold its own against the car icon and battery opposite; the unit
  // drops back to body size so the number is what catches the eye.
  return (
    <div style={{ marginLeft: "64px", fontSize: "64px" }}>
      {content}
      <span style={{ fontSize: "40px" }}>W</span>
    </div>
  );
}
