import { MessageSender } from "./message-sender.mjs";
import { MatrixClient } from "matrix-bot-sdk";
import { logger } from "../logger.mjs";

export class MatrixSender extends MessageSender {
  private matrixClient: MatrixClient;

  constructor(homeserverUrl: string, accessToken: string, private roomId: string) {
    super();
    this.matrixClient = new MatrixClient(homeserverUrl, accessToken);
  }

  async sendMessage(message: string): Promise<void> {
    logger.info(`Sending Matrix message to ${this.roomId}`)
    await this.matrixClient.sendText(this.roomId, message);
  }
}
