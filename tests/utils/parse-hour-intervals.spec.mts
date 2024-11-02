import { parseHourIntervals } from "../../src/utils/parse-hour-intervals.mjs";
import { expect, describe, it, vi } from 'vitest'

describe("parse hour intervals", () => {
  it("can parse a single number", () => {
    process.env.WARNING_HOURS = "1";
    expect(parseHourIntervals()).toEqual([1]);
  });

  it("can parse multiple numbers", () => {
    process.env.WARNING_HOURS = "1,2,4";
    expect(parseHourIntervals()).toEqual([1, 2, 4]);
  });

  it("will fail if value is empty", () => {
    process.env.WARNING_HOURS = "";
    expect(() => parseHourIntervals()).toThrow();
  });

  it("will fail if value is not only numbers", () => {
    process.env.WARNING_HOURS = "1,2,igowhe";
    expect(() => parseHourIntervals()).toThrow();
  });

  it("will fail if value is not a number", () => {
    process.env.WARNING_HOURS = "1,2,igowhe";
    expect(() => parseHourIntervals()).toThrow();
  });
});
