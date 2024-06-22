import { DateTime } from "luxon";
import { ApiResponse, fetchNextMatch } from "../../src/message-generation/fetch-next-match.mjs";

describe("fetch next match", () => {
  it("can fetch and parse data correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          data: {
            matchcontentfragmentmodelList: {
              items: [{
                date: "2024-04-16",
                adversaryTeam: {
                  viewName: "Away"
                },
                homeTeam: {
                  viewName: "Home"
                },
                time: "21:00:00"
              }]
            }
          }
        } as ApiResponse)
      })
    ) as jest.Mock;

    const result = await fetchNextMatch();
    expect(result?.awayTeam).toBe("Away");
    expect(result?.homeTeam).toBe("Home");
    expect(result?.time).toEqual(DateTime.fromSeconds(1713294000));
  });

  it("can fetch and parse data correctly", async () => {
    global.fetch = jest.fn(() =>
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

    const result = await fetchNextMatch();
    expect(result).toBeNull();
  });
});

