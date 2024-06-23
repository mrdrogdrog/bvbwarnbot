import { DateTime, Settings } from "luxon";
import { isInRanges } from "../../src/utils/is-in-ranges.mjs";


describe("is in ranges", () => {
  beforeEach(() => {
    Settings.defaultZone = "Europe/Berlin";
  });

  it("will return hours if found (with real dates)", () => {
    const fakeNow = DateTime.fromSeconds(1713283007);
    const matchTimestamp = DateTime.fromSeconds(1713294000);
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6]);
    expect(result).toBe(3);
  });

  it("will return hours if found(with real dates 2)", () => {
    const matchTime = DateTime.fromISO("2024-06-23T19:00:00Z", { zone: "utc" });
    Settings.now = () => 1719082800000;

    console.log(matchTime);
    console.log(DateTime.now());
    const result = isInRanges(matchTime, [24]);
    expect(result).toBe(24);
  });

  it("will return hours if found", () => {
    const fakeNow = DateTime.fromSeconds(1000000);
    const matchTimestamp = fakeNow.plus({ hours: 3 });
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6]);
    expect(result).toBe(3);
  });

  it("will return null now is before", () => {
    const fakeNow = DateTime.fromSeconds(10000000);
    const matchTimestamp = fakeNow.plus({ hours: -1 });
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6]);
    expect(result).toBe(null);
  });

  it("will return null now is after all hours", () => {
    const fakeNow = DateTime.fromSeconds(10000000);
    const matchTimestamp = fakeNow.plus({ hours: 7 });
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6]);
    expect(result).toBe(null);
  });
});
