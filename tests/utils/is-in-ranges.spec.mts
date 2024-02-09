import { DateTime, Settings } from "luxon";
import { isInRanges } from "../../src/utils/is-in-ranges.mjs";


describe("is in ranges", () => {
  it("will return hours if found", () => {
    const fakeNow= DateTime.fromSeconds(1000000)
    const matchTimestamp = fakeNow.plus({hours: 3})
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6])
    expect(result).toBe(3)
  })

  it("will return null now is before", () => {
    const fakeNow= DateTime.fromSeconds(10000000)
    const matchTimestamp = fakeNow.plus({hours: -1})
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6])
    expect(result).toBe(null)
  })

  it("will return null now is after all hours", () => {
    const fakeNow= DateTime.fromSeconds(10000000)
    const matchTimestamp = fakeNow.plus({hours: 7})
    Settings.now = () => fakeNow.toMillis();

    const result = isInRanges(matchTimestamp, [1, 3, 6])
    expect(result).toBe(null)
  })
})
