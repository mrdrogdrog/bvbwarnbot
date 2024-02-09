import { TelegramSender } from "./sender/telegram-sender.mjs";
import { parseEnvVar } from "./check-env-vars.mjs";
import { MessageSender } from "./sender/message-sender.mjs";
import { logger } from "./logger.mjs";
import { MatrixSender } from "./sender/matrix-sender.mjs";
import { generateMessage } from "./message-generation/generate-message.mjs";
import { fetchNextMatch } from "./message-generation/fetch-next-match.mjs";
import { isInRanges } from "./is-in-ranges.mjs";
import { schedule } from "node-cron";

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

async function check() {
  const matchData = await fetchNextMatch();
  const nextMatchHours = isInRanges(matchData.time, [4, 24]);
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

logger.log("One for now...");
await check().catch(logError.bind(this));
logger.log("... And the rest for the road.");
schedule("0 */1 * * *", () => {
  logger.log("Rise and Shine! Time for another check");
  check().catch(logError.bind(this));
});
