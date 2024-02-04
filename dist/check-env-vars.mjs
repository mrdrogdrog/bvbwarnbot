import { logger } from "./logger.mjs";
export function checkAndExtractVar(varName) {
    const value = process.env[varName];
    if (value === undefined) {
        logger.error(`${varName} is not set`);
        process.exit(1);
    }
    return value;
}
