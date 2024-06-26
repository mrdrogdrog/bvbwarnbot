import { DateTime } from "luxon";


export type Reason = "emGermanTeam" | "emLocationDortmund" | "emGermanTeamInDortmund" | "bvbHomecoming" | "bvbAway"


export interface MatchData {
  homeTeam: string,
  awayTeam: string,
  time: DateTime
  reason: Reason
}
