import { TelegramSender } from "./sender/telegram-sender.mjs";
import { MessageSender } from "./sender/message-sender.mjs";
import { MatrixSender } from "./sender/matrix-sender.mjs";
import { generateMessage } from "./message-generation/generate-message.mjs";
import { fetchNextMatch } from "./message-generation/fetch-next-match.mjs";
import { schedule } from "node-cron";
import { parseHourIntervals } from "./utils/parse-hour-intervals.mjs";
import { parseEnvVar } from "./utils/check-env-vars.mjs";
import { isInRanges } from "./utils/is-in-ranges.mjs";
import { logger } from "./utils/logger.mjs";
import { Settings } from "luxon";

Settings.defaultZone = "Europe/Berlin";

const senders: MessageSender[] = [
  new TelegramSender(
    parseEnvVar("TELEGRAM_API_TOKEN"),
    parseEnvVar("TELEGRAM_CHAT_ID"),
  ),
  new MatrixSender(
    parseEnvVar("MATRIX_HOMESERVER_URL"),
    parseEnvVar("MATRIX_ACCESS_TOKEN"),
    parseEnvVar("MATRIX_ROOM_ID"),
  ),
];

const errorSender = new TelegramSender(
  parseEnvVar("TELEGRAM_API_TOKEN"),
  parseEnvVar("TELEGRAM_ERROR_CHAT_ID"),
);

const TEAM_NAME_DORTMUND = "Borussia Dortmund";

const hourIntervals = parseHourIntervals();

async function check() {
  const matchData = await fetchNextMatch();
  const nextMatchHours = isInRanges(matchData.time, hourIntervals);
  if (nextMatchHours === null) {
    return;
  }
  logger.info(`found a match in ${nextMatchHours} hours.`);
  const message = await generateMessage(
    nextMatchHours,
    matchData.time,
    matchData.awayTeam,
    matchData.homeTeam,
    matchData.homeTeam === TEAM_NAME_DORTMUND,
  );

  await Promise.all(senders.map((sender) => sender.sendMessage(message)));
}

function logError(error: Error) {
  errorSender
    .sendMessage(error.message)
    .catch((telegramError) => logger.error(telegramError));
  logger.error(error);
}

logger.log("One check now...");
await check().catch((error) => logError(error));
logger.log("... and the rest later.");
logger.log("Sending message about startup");
await errorSender.sendMessage("Bot is up");
logger.log("starting schedule");
schedule("0 */1 * * *", () => {
  logger.log("Rise and Shine! Time for another check");
  check().catch((error) => logError(error));
});
