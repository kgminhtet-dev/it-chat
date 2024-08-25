export interface NewChatEventDto {
  content: string;
  sender: string;
  participants: string[];
  chatId: string;
}
