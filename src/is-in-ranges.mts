import { DateTime } from "luxon";

export function isInRanges(targetTime: DateTime, hours: number[]): number | null {
  for (const hour of hours) {
    if (isInRange(targetTime, hour)) {
      return hour;
    }
  }
  return null;
}


function isInRange(targetTime: DateTime, hours: number): boolean {
  const later = DateTime.now().plus({ hours: hours });
  const laterPlusOne = DateTime.now().plus({ hours: hours + 1 });
  return targetTime >= later && targetTime < laterPlusOne;
}
