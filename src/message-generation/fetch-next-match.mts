import { JSDOM } from "jsdom";
import { DateTime } from "luxon";

export interface MatchData {
  homeTeam: string,
  awayTeam: string,
  time: DateTime
}

function parseTime(dom: JSDOM): DateTime {
  const rawTime = dom.window.document.querySelector(".next-match .icon-clock time")?.getAttribute("datetime");
  if (!rawTime) {
    throw new Error("no time");
  }
  return DateTime.fromISO(rawTime);
}

function parseTeam(dom: JSDOM, selector: string): string {
  const teamName = dom.window.document.querySelector(`.next-match .${selector} span`)?.textContent;
  if (!teamName) {
    throw new Error(`couldn't find ${selector}`);
  }
  return teamName;
}

export async function fetchNextMatch(): Promise<MatchData> {
  const response = await fetch("https://www.bvb.de/");
  const dom = new JSDOM(await response.text());
  const homeTeam = parseTeam(dom, "home-team");
  const awayTeam = parseTeam(dom, "away-team");
  const time = parseTime(dom);

  return {
    homeTeam, awayTeam, time
  };
}
