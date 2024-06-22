import { DateTime } from "luxon";
import { renderFile } from "ejs";
import { MatchData } from "./types.mjs";


export async function generateMessage(hour: number, match: MatchData): Promise<string> {
  const time = match.time.setZone("Europe/Berlin");
  const formattedDate = `${toRelativeTime(time)}${time.toFormat("dd.MM.yyyy - HH:mm")}`;

  return await renderFile(`./templates/${match.reason}.ejs`, { formattedDate, awayTeam: match.awayTeam, homeTeam: match.homeTeam, hour });
}

function toRelativeTime(date: DateTime) {
  const now = DateTime.now();
  if (date.day === now.day) {
    return "Heute, ";
  } else if (date.day === now.day + 1) {
    return "Morgen, ";
  } else {
    return "";
  }
}
