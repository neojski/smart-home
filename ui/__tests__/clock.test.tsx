import React from "react";
import renderer from "react-test-renderer";
import { Clock } from "../Clock";
import { advanceTo } from "jest-date-mock";

it("renders correctly", async () => {
  advanceTo(new Date(2020, 1, 1, 12, 13, 14));

  const testRenderer = renderer.create(<Clock />);
  expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
    <div
      style={
        Object {
          "fontSize": "300px",
          "fontWeight": 300,
          "textAlign": "center",
        }
      }
    >
      12
      <span
        style={
          Object {
            "visibility": "hidden",
          }
        }
      >
        :
      </span>
      13
      <span
        style={
          Object {
            "display": "inline-block",
            "fontSize": "30%",
            "transform": "translate(0, -30px) rotate(-90deg)",
          }
        }
      >
        14
      </span>
    </div>
  `);
  testRenderer.unmount();
});
