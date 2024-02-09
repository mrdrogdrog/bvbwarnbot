import { DateTime } from "luxon";
import { renderFile } from "ejs";


export async function generateMessage(hour: number, date: DateTime, awayTeam: string, homeTeam: string, homecoming: boolean): Promise<string> {
  const formattedDate = `${toRelativeTime(date)}${date.toFormat("dd.MM.yyyy - HH:mm")}`;

  return await renderFile("./message-template.ejs", { formattedDate, awayTeam, homeTeam, homecoming, hour });
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
