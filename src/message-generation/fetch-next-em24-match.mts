import { DateTime } from "luxon";
import { MatchData, Reason } from "./types.mjs";

export interface RawApiMatch {
  matchDateTimeUTC: string,
  team1: {
    teamName: string
  },
  team2: {
    teamName: string
  }
  location: {
    locationID: number
    locationCity: string
  }

}

export interface ParsedApiMatch extends Omit<RawApiMatch, "matchDateTimeUTC"> {
  matchDateTimeUTC: DateTime;
}

const TEAM_NAME = "Deutschland";
const LOCATION_NAME_DORTMUND = "Dortmund";
const LOCATION_ID_DORTMUND = 974

function isComingMatch(match: ParsedApiMatch, today: DateTime): boolean {
  return match.matchDateTimeUTC >= today;
}

function determineReason(match: ParsedApiMatch): Reason | null {
  if (match.location.locationID === LOCATION_ID_DORTMUND || match.location.locationCity.toLowerCase().includes(LOCATION_NAME_DORTMUND.toLowerCase())) {
    return "emLocationDortmund";
  } else if (match.team1.teamName === TEAM_NAME || match.team2.teamName === TEAM_NAME) {
    return "emGermanTeam";
  } else {
    return null;
  }
}

function parseMatchData(matches: RawApiMatch[]): ParsedApiMatch[] {
  return matches.map(match => ({
    ...match,
    matchDateTimeUTC: DateTime.fromISO(match.matchDateTimeUTC, { zone: "utc" })
  }));
}

export async function fetchNextEmMatches(): Promise<MatchData[]> {
  const today = DateTime.now();
  const response = await fetch(`https://api.openligadb.de/getmatchdata/em2024`);
  const matches = await response.json() as RawApiMatch[];
  return parseMatchData(matches)
    .filter(match => isComingMatch(match, today))
    .map(match => {

      const reason: Reason | null = determineReason(match);
      if (reason === null) {
        return null;
      }
      return {
        homeTeam: match.team1.teamName,
        awayTeam: match.team2.teamName,
        time: match.matchDateTimeUTC,
        reason
      } as MatchData;
    })
    .filter(match => match !== null) as MatchData[];
}
