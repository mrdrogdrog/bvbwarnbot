import { DateTime } from "luxon";
import { ApiResponse, fetchNextBvbMatch } from "../../src/message-generation/fetch-next-bvb-match.mjs";
import { expect, describe, it, vi, beforeEach } from 'vitest'

describe("fetch next bvb match", () => {
  it("can detect the next homecoming game", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            matchcontentfragmentmodelList: {
              items: [{
                date: "2024-04-16",
                adversaryTeam: {
                  team: "Away"
                },
                homeTeam: {
                  team: "Borussia Dortmund"
                },
                time: "21:00:00"
              }]
            }
          }
        } as ApiResponse)
      })
    ) as vi.Mock;

    const result = await fetchNextBvbMatch();
    expect(result[0].awayTeam).toBe("Away");
    expect(result[0].homeTeam).toBe("Borussia Dortmund");
    expect(result[0].time).toEqual(DateTime.fromSeconds(1713294000));
    expect(result[0].reason).toBe("bvbHomecoming")
  });

  it("can detect the next away game", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            matchcontentfragmentmodelList: {
              items: [{
                date: "2024-04-16",
                adversaryTeam: {
                  team: "Borussia Dortmund"
                },
                homeTeam: {
                  team: "Away"
                },
                time: "21:00:00"
              }]
            }
          }
        } as ApiResponse)
      })
    ) as jest.Mock;

    const result = await fetchNextBvbMatch();
    expect(result[0].awayTeam).toBe("Borussia Dortmund");
    expect(result[0].homeTeam).toBe("Away");
    expect(result[0].time).toEqual(DateTime.fromSeconds(1713294000));
    expect(result[0].reason).toBe("bvbAway")
  });

  it("can fetch and parse data correctly", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            matchcontentfragmentmodelList: {
              items: []
            }
          }
        } as ApiResponse)
      })
    ) as jest.Mock;

    const result = await fetchNextBvbMatch();
    expect(result.length).toBe(0);
  });
});

