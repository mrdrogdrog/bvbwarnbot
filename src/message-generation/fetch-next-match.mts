import { DateTime } from "luxon";

export interface MatchData {
  homeTeam: string,
  awayTeam: string,
  time: DateTime
}

export interface ApiResponse {
  data: {
    matchcontentfragmentmodelList: {
      items: {
        date: string,
        time: string,
        homeTeam: {
          viewName: string
        }
        adversaryTeam: {
          viewName: string
        }
      }[]
    }
  }
}

export async function fetchNextMatch(): Promise<MatchData | null> {
  const today = DateTime.now().toFormat("yyyy-MM-dd")
  const response = await fetch(`https://www.bvb.de/graphql/execute.json/bvbweb/get-future-and-current-matches-by-filter;filterLevelTwo=football;today=${today};`);
  const content = await response.json() as ApiResponse

  const item = content.data.matchcontentfragmentmodelList.items[0];
  if (item === undefined) {
    return null;
  }
  const homeTeam = item.homeTeam.viewName;
  const awayTeam = item.adversaryTeam.viewName;
  const date = item.date;
  const time = item.time;

  const finalDate = DateTime.fromISO(`${date}T${time}+02:00`)

  return {
    homeTeam, awayTeam, time: finalDate
  };
}
