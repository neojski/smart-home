/* Screenshot tests: render Car in a real chromium and compare pixels against
   the goldens committed under __screenshots__. After an intentional visual
   change, regenerate them with: npx vitest run --update */

import React from "react";
import { render } from "vitest-browser-react";
import { Car } from "../Car";
import "../css/style.css";

const cases: {
  label: string;
  props: Parameters<typeof Car>[0];
}[] = [
  {
    label: "idle, both limits at 80",
    props: {
      battery: "80",
      teslaChargeLimit: "80",
      octopusChargeTarget: "80",
      intelligentState: undefined,
      intelligentDispatching: "off",
    },
  },
  {
    label: "plugged in, tesla 100, octopus 80",
    props: {
      battery: "60",
      teslaChargeLimit: "100",
      octopusChargeTarget: "80",
      intelligentState: "SMART_CONTROL_CAPABLE",
      intelligentDispatching: "off",
    },
  },
  {
    label: "boosting, both limits at 100",
    props: {
      battery: "60",
      teslaChargeLimit: "100",
      octopusChargeTarget: "100",
      intelligentState: "BOOSTING",
      intelligentDispatching: "off",
    },
  },
  {
    label: "dispatching, tesla 90, octopus 50",
    props: {
      battery: "90",
      teslaChargeLimit: "90",
      octopusChargeTarget: "50",
      intelligentState: "SMART_CONTROL_IN_PROGRESS",
      intelligentDispatching: "on",
    },
  },
  {
    label: "octopus limit unavailable",
    props: {
      battery: "55",
      teslaChargeLimit: "80",
      octopusChargeTarget: "unavailable",
      intelligentState: "SMART_CONTROL_CAPABLE",
      intelligentDispatching: "off",
    },
  },
  {
    label: "no battery data (renders nothing)",
    props: {
      battery: undefined,
      teslaChargeLimit: undefined,
      octopusChargeTarget: undefined,
      intelligentState: undefined,
      intelligentDispatching: undefined,
    },
  },
];

for (const { label, props } of cases) {
  test(label, async () => {
    const screen = await render(
      // minHeight keeps the screenshot region non-empty for the
      // renders-nothing case.
      <div data-testid="case" style={{ width: "480px", minHeight: "40px" }}>
        <Car {...props} />
      </div>,
    );
    // The battery text renders in Roboto (see css/style.css); screenshot only
    // once the font is in so goldens don't depend on load timing.
    await document.fonts.ready;
    await expect(screen.getByTestId("case")).toMatchScreenshot(label);
  });
}
