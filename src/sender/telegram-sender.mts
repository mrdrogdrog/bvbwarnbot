import { MessageSender } from "./message-sender.mjs";
import { Telegraf } from "telegraf";
import { logger } from "../utils/logger.mjs";

export class TelegramSender extends MessageSender {
  private telegraf: Telegraf
  constructor(apiToken: string, private chatId: string) {
    super();
    this.telegraf = new Telegraf(apiToken)
  }

  async sendMessage(message: string): Promise<void> {
      logger.info(`Sending Telegram message to ${this.chatId}`)
      await this.telegraf.telegram.sendMessage(this.chatId, message, {parse_mode: "Markdown"})
  }

}
