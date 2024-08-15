export interface IMessage {
  id: string;
  content: string;
  sender: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}
