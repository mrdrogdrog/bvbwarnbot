import { parseEnvVar } from "./check-env-vars.mjs";

export function parseHourIntervals(): number[] {
  const values = parseEnvVar("WARNING_HOURS")
    .split(",")
    .map(value => parseInt(value))
  if (values.length === 0) {
    throw new Error("WARNING_HOURS must contain at least one number")
  }
  for (const value of values){
    if (isNaN(value)) {
      throw new Error("WARNING_HOURS must contain only numbers")
    }
  }
  return values
}
