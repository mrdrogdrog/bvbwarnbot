import { DateTime } from "luxon";
import { fetchNextMatch } from "../../src/message-generation/fetch-next-match.mjs";

describe("fetch next match", () => {
  it("can fetch and parse data correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("<div class='next-match'>" +
          "<div class='home-team'><span>Home</span></div>" +
          "<div class='away-team'><span>Away</span></div>" +
          "<div class='icon-clock'><time datetime='2024-02-04T21:25:49.000+01:00'></time></div>" +
          "</div>")
      })
    ) as jest.Mock;

    const result = await fetchNextMatch();

    expect(result.awayTeam).toBe("Away");
    expect(result.homeTeam).toBe("Home");
    expect(result.time).toEqual(DateTime.fromSeconds(1707078349));
  });

  it("will throw if home team is missing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("<div class='next-match'>" +
          "<div class='away-team'><span>Away</span></div>" +
          "<div class='icon-clock'><time datetime='2024-02-04T21:25:49.000+01:00'></time></div>" +
          "</div>")
      })
    ) as jest.Mock;

    await expect(async () => await fetchNextMatch()).rejects.toThrow("couldn't find home-team");
  });

  it("will throw if away team is missing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("<div class='next-match'>" +
          "<div class='home-team'><span>Home</span></div>" +
          "<div class='icon-clock'><time datetime='2024-02-04T21:25:49.000+01:00'></time></div>" +
          "</div>")
      })
    ) as jest.Mock;

    await expect(async () => await fetchNextMatch()).rejects.toThrow("couldn't find away-team");
  });

  it("will throw if date is missing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("<div class='next-match'>" +
          "<div class='home-team'><span>Home</span></div>" +
          "<div class='away-team'><span>Away</span></div>" +
          "</div>")
      })
    ) as jest.Mock;

    await expect(async () => await fetchNextMatch()).rejects.toThrow("no time");
  });
});

