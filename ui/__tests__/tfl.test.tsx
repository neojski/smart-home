/* Screenshot test for the tube train diagram that heads the line status.
   After an intentional visual change, regenerate the golden with:
   npx vitest run --update */

import { render } from "vitest-browser-react";
import { TubeTrain } from "../Tfl";
import "../css/style.css";

test("tube train", async () => {
  const screen = await render(
    <div data-testid="case" style={{ width: "200px" }}>
      <TubeTrain />
    </div>,
  );
  await expect(screen.getByTestId("case")).toMatchScreenshot("tube train");
});
