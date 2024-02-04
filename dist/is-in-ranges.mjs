import { DateTime } from "luxon";
export function isInRanges(targetTime, hours) {
    for (const hour of hours) {
        if (isInRange(targetTime, hour)) {
            return hour;
        }
    }
    return null;
}
function isInRange(targetTime, hours) {
    const later = DateTime.now().plus({ hours: hours });
    const laterPlusOne = DateTime.now().plus({ hours: hours + 1 });
    return targetTime >= later && targetTime < laterPlusOne;
}
