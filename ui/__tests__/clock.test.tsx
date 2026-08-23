import React, { act } from "react";
import { Clock } from "../Clock";
import { render } from "@testing-library/react";

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2020-01-01"));
});

afterAll(() => {
  vi.useRealTimers();
});

it("renders correctly and updates over time", () => {
  const { container } = render(<Clock />);

  expect(Date.now()).toBe(1577836800000);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        style="font-size: 300px; font-weight: 300; text-align: center;"
      >
        00
        <span
          style="visibility: hidden;"
        >
          :
        </span>
        00
        <span
          style="font-size: 30%; display: inline-block; transform: translate(0px, -30px) rotate(-90deg);"
        >
          00
        </span>
      </div>
    </div>
  `);

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(Date.now()).toBe(1577836801000);

  // A second on from the snapshot above: the seconds read 01 rather than 00
  // and the colon has blinked back to visible, so this covers the state
  // update and rerender on the setInterval tick.
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        style="font-size: 300px; font-weight: 300; text-align: center;"
      >
        00
        <span
          style="visibility: visible;"
        >
          :
        </span>
        00
        <span
          style="font-size: 30%; display: inline-block; transform: translate(0px, -30px) rotate(-90deg);"
        >
          01
        </span>
      </div>
    </div>
  `);
});
