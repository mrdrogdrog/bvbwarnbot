export abstract class MessageSender {
  abstract sendMessage(message: string): Promise<void>;
}
