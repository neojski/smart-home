/* Screenshot tests: render every weather condition in a real chromium and
   compare pixels against the goldens committed under __screenshots__. After
   an intentional visual change, regenerate them with: npx vitest run --update

   The grids are the point of these tests. Home Assistant's conditions are a
   closed vocabulary, so a single golden per time of day shows all of them at
   once — a mapping that goes wrong shows up as a changed picture rather than
   as a blank space on the mirror. */

import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Weather, WeatherIcon } from "../Weather";
import type { Condition } from "../weatherIcons";
import "../css/style.css";
import "../css/weather-icons.min.css";

const conditions: Condition[] = [
  "sunny",
  "clear-night",
  "partlycloudy",
  "cloudy",
  "fog",
  "rainy",
  "pouring",
  "snowy-rainy",
  "snowy",
  "hail",
  "lightning",
  "lightning-rainy",
  "windy",
  "windy-variant",
  "exceptional",
];

/* style.css makes the page unscrollable (the mirror never scrolls), so
   anything wider than the viewport is clipped away unpainted instead of being
   captured. Each test asks for a viewport big enough for what it renders. */

/* The icons are drawn in the weathericons font and the labels in Roboto;
   screenshot only once both are in so goldens don't depend on load timing. */
async function fontsReady() {
  await document.fonts.load('64px "weathericons"');
  await document.fonts.ready;
}

for (const sun of ["above_horizon", "below_horizon"]) {
  test(`all conditions, sun ${sun}`, async () => {
    await page.viewport(1040, 560);
    const screen = await render(
      <div
        data-testid="case"
        style={{
          display: "grid",
          width: "1000px",
          gridTemplateColumns: "repeat(5, 200px)",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        {conditions.map((condition) => (
          <div key={condition} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", lineHeight: 1.4 }}>
              <WeatherIcon condition={condition} sun={sun} />
            </div>
            <div style={{ fontSize: "16px" }}>{condition}</div>
          </div>
        ))}
      </div>,
    );
    await fontsReady();
    await expect(screen.getByTestId("case")).toMatchScreenshot(
      `all conditions, sun ${sun}`,
    );
  });
}

const unknownCases: { label: string; condition: string | undefined }[] = [
  { label: "no condition yet", condition: undefined },
  { label: "unavailable entity", condition: "unavailable" },
  { label: "condition we do not know", condition: "meteor-shower" },
];

for (const { label, condition } of unknownCases) {
  test(label, async () => {
    await page.viewport(414, 300);
    const screen = await render(
      <div data-testid="case" style={{ fontSize: "64px", padding: "20px" }}>
        <WeatherIcon condition={condition} sun="above_horizon" />
      </div>,
    );
    await fontsReady();
    await expect(screen.getByTestId("case")).toMatchScreenshot(label);
  });
}

test("the whole weather line", async () => {
  // The mirror is 1080px across; at anything less the 140px line wraps.
  await page.viewport(1080, 400);
  const screen = await render(
    <div data-testid="case">
      <Weather
        upTemperature="20.62"
        downTemperature="19.67"
        outsideTemperature="17.64"
        weatherCondition="cloudy"
        sun="below_horizon"
      />
    </div>,
  );
  await fontsReady();
  await expect(screen.getByTestId("case")).toMatchScreenshot(
    "the whole weather line",
  );
});
