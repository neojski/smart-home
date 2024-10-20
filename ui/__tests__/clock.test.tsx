import React from "react";
import renderer, { act } from "react-test-renderer";
import { Clock } from "../Clock";

jest.useFakeTimers();
it("renders correctly", async () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  const testRenderer = renderer.create(<Clock />);

  expect(Date.now()).toMatchInlineSnapshot(`1577836800000`);

  expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
    <div
      style={
        {
          "fontSize": "300px",
          "fontWeight": 300,
          "textAlign": "center",
        }
      }
    >
      00
      <span
        style={
          {
            "visibility": "hidden",
          }
        }
      >
        :
      </span>
      00
      <span
        style={
          {
            "display": "inline-block",
            "fontSize": "30%",
            "transform": "translate(0, -30px) rotate(-90deg)",
          }
        }
      >
        00
      </span>
    </div>
  `);

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(Date.now()).toMatchInlineSnapshot(`1577836801000`);

  // TODO: the advance time doesn't seem to work for the react component: the visibility is still hidden and seconds have not advanced
  expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
    <div
      style={
        {
          "fontSize": "300px",
          "fontWeight": 300,
          "textAlign": "center",
        }
      }
    >
      00
      <span
        style={
          {
            "visibility": "hidden",
          }
        }
      >
        :
      </span>
      00
      <span
        style={
          {
            "display": "inline-block",
            "fontSize": "30%",
            "transform": "translate(0, -30px) rotate(-90deg)",
          }
        }
      >
        00
      </span>
    </div>
  `);

  testRenderer.unmount();
});
