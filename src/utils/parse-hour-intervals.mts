import { parseEnvVar } from "./check-env-vars.mjs";

export function parseHourIntervals(): number[] {
  const values = parseEnvVar("WARNING_HOURS")
    .split(",")
    .map(value => parseInt(value));
  for (const value of values) {
    if (isNaN(value)) {
      throw new Error("WARNING_HOURS must contain only numbers");
    }
  }
  return values;
}
