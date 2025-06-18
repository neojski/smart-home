import React, { act } from "react";
import { Clock } from "../Clock";
import { render } from '@testing-library/react'

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2020-01-01"));
});

afterAll(() => {
  jest.useRealTimers();
});

it("renders correctly and updates over time", () => {
  render(<Clock />);

  expect(Date.now()).toBe(1577836800000);

  expect(document.body.firstChild).toMatchInlineSnapshot(`
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
      style="font-size: 30%; display: inline-block; transform: translate(0, -30px) rotate(-90deg);"
    >
      00
    </span>
  </div>
</div>
`);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(Date.now()).toBe(1577836801000);

  // TODO: ensure the Clock component updates its state and rerenders when time advances
  expect(document.body.firstChild).toMatchInlineSnapshot(`
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
      style="font-size: 30%; display: inline-block; transform: translate(0, -30px) rotate(-90deg);"
    >
      01
    </span>
  </div>
</div>
`);
});