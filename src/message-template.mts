import { DateTime } from "luxon";

export function generateMessage(hour: number, date: DateTime, awayTeam: string, homeTeam: string, homecoming: boolean): string {
  return `⚠️${hour}h-Warnung!⚠️

${toRelativeTime(date)}${date.toFormat("dd.MM.yyyy - HH:mm")}
${homeTeam} vs ${awayTeam}

${homecoming ? generateHomecomingSubMessage() : generateAwaySubMessage()}`;
}

function generateHomecomingSubMessage() {
  return `🏠Heimspiel
Vermeide U42 / U46 / Kreuzviertel / Borsigplatz / Uni-Parkplatz`;
}

function generateAwaySubMessage() {
  return `🏕Auswärtsspiel
Vermeide Kneipen mit TV`;
}

function toRelativeTime(date: DateTime) {
  const now = DateTime.now()
  if (date.day === now.day) {
    return "Heute, "
  } else if (date.day === now.day + 1) {
    return "Morgen, "
  } else {
    return ""
  }
}
