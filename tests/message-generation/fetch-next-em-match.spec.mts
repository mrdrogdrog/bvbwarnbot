import { fetchNextEmMatches, RawApiMatch } from "../../src/message-generation/fetch-next-em24-match.mjs";
import { DateTime, Settings } from "luxon";

describe("fetch next em match", () => {
  beforeEach(() => {
    Settings.now = () => 1719054954478;
    Settings.defaultZone = "Europe/Berlin";
  });

  it("will ignore games in the past", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            matchDateTimeUTC: "2024-05-02",
            team2: { teamName: "team2" },
            team1: { teamName: "team1" },
            location: { locationCity: "Dortmund" }
          },
          {
            matchDateTimeUTC: "2024-05-03",
            team2: { teamName: "Deutschland" },
            team1: { teamName: "team3" },
            location: { locationCity: "Hamburg" }
          },
          {
            matchDateTimeUTC: "2024-05-03",
            team2: { teamName: "team4" },
            team1: { teamName: "Deutschland" },
            location: { locationCity: "Hamburg" }
          }
        ] as RawApiMatch[])
      })
    ) as jest.Mock;

    const matches = await fetchNextEmMatches();
    expect(matches.length).toBe(0);
  });

  it("will show games of the german team", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "Deutschland" },
            team1: { teamName: "team3" },
            location: { locationCity: "Hamburg" }
          },
          {
            matchDateTimeUTC: "2024-09-04T12:00:00",
            team2: { teamName: "team4" },
            team1: { teamName: "Deutschland" },
            location: { locationCity: "Hamburg" }
          }
        ] as RawApiMatch[])
      })
    ) as jest.Mock;

    const matches = await fetchNextEmMatches();
    expect(matches).toEqual([{
      "awayTeam": "Deutschland",
      "homeTeam": "team3",
      "reason": "emGermanTeam",
      "time": DateTime.fromISO("2024-09-03T12:00:00", { zone: "utc" })
    }, {
      "awayTeam": "team4",
      "homeTeam": "Deutschland",
      "reason": "emGermanTeam",
      "time": DateTime.fromISO("2024-09-04T12:00:00", { zone: "utc" })
    }
    ]);
  });


  it("will show games that are located in dortmund", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "team4" },
            team1: { teamName: "team3" },
            location: { locationID: 123, locationCity: "Dortmund" }
          },
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "team6" },
            team1: { teamName: "team7" },
            location: { locationID: 974, locationCity: "Asad" }
          },
          {
            matchDateTimeUTC: "2024-09-04T12:00:00",
            team2: { teamName: "team4" },
            team1: { teamName: "team5" },
            location: { locationID: 974, locationCity: "Dortmund" }
          }
        ] as RawApiMatch[])
      })
    ) as jest.Mock;

    const matches = await fetchNextEmMatches();
    expect(matches).toEqual([{
      "awayTeam": "team4",
      "homeTeam": "team3",
      "reason": "emLocationDortmund",
      "time": DateTime.fromISO("2024-09-03T12:00:00", { zone: "utc" })
    }, {
      "awayTeam": "team6",
      "homeTeam": "team7",
      "reason": "emLocationDortmund",
      "time": DateTime.fromISO("2024-09-03T12:00:00.000Z", { zone: "utc" })
    }, {
      "awayTeam": "team4",
      "homeTeam": "team5",
      "reason": "emLocationDortmund",
      "time": DateTime.fromISO("2024-09-04T12:00:00", { zone: "utc" })
    }
    ]);
  });


  it("will ignore games that are not in dortmund and not the german team", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "team4" },
            team1: { teamName: "team3" },
            location: { locationCity: "Irgendwo" }
          }
        ] as RawApiMatch[])
      })
    ) as jest.Mock;

    const matches = await fetchNextEmMatches();
    expect(matches).toEqual([]);
  });


  it("will combine emGermanTeam and emLocationDortmund", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "Deutschland" },
            team1: { teamName: "team3" },
            location: { locationCity: "Dortmund" }
          },
          {
            matchDateTimeUTC: "2024-09-03T12:00:00",
            team2: { teamName: "team9" },
            team1: { teamName: "Deutschland" },
            location: { locationCity: "Dortmund" }
          }
        ] as RawApiMatch[])
      })
    ) as jest.Mock;

    const matches = await fetchNextEmMatches();
    expect(matches).toEqual([{
      "awayTeam": "Deutschland",
      "homeTeam": "team3",
      "reason": "emGermanTeamInDortmund",
      "time": DateTime.fromISO("2024-09-03T12:00:00", { zone: "utc" })
    },{
      "awayTeam": "team9",
      "homeTeam": "Deutschland",
      "reason": "emGermanTeamInDortmund",
      "time": DateTime.fromISO("2024-09-03T12:00:00", { zone: "utc" })
    }
    ]);
  });

});

