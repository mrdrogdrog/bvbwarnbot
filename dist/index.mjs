import { fetchAndParse } from "./fetch-and-parse.mjs";
import { isInRanges } from "./is-in-ranges.mjs";
async function check() {
    const matchData = await fetchAndParse();
    const matchingHour = (isInRanges(matchData.time, [4, 24]));
    if (matchingHour === null) {
        return;
    }
    console.log("found");
}
// logger.log("One for now...");
await check();
//
// logger.log("... And the rest for the road.");
// schedule("0 */1 * * *", () => {
//   logger.log("Rise and Shine! Time for another import");
//   check().catch(logger.error.bind(this));
// });
