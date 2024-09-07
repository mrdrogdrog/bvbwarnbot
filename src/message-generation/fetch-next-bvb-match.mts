import { DateTime } from "luxon";
import { MatchData } from "./types.mjs";

const TEAM_NAME_DORTMUND = "Borussia Dortmund";

export interface ApiResponse {
  data: {
    matchcontentfragmentmodelList: {
      items: {
        date: string,
        time: string,
        homeTeam: {
          team: string
        }
        adversaryTeam: {
          team: string
        }
      }[]
    }
  };
}

export async function fetchNextBvbMatch(): Promise<MatchData[]> {
  const today = DateTime.now().toFormat("yyyy-MM-dd");
  const response = await fetch(`https://www.bvb.de/graphql/execute.json/bvbweb/get-future-and-current-matches-by-filter;filterLevelTwo=football;filterLevelThree=profis;today=${today};`);
  const content = await response.json() as ApiResponse;

  const item = content.data.matchcontentfragmentmodelList.items[0];
  if (item === undefined) {
    return [];
  }
  const homeTeam = item.homeTeam.team;
  const awayTeam = item.adversaryTeam.team;
  const date = item.date;
  const time = item.time;

  const finalDate = DateTime.fromISO(`${date}T${time}+02:00`);

  return [{
    homeTeam, awayTeam, time: finalDate, reason: homeTeam === TEAM_NAME_DORTMUND ? "bvbHomecoming" : "bvbAway"
  }];
}
