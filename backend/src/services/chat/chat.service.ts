import { Injectable } from '@nestjs/common';
import { ChatRepoService } from '../repository/Chat/chat-repo.service';
import { MessageRepoService } from '../repository/Message/message-repo.service';
import { IMessage } from '../../types/message';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepoService: ChatRepoService,
    private readonly messageRepoService: MessageRepoService,
  ) {}

  saveMessage(message: IMessage) {
    return this.messageRepoService.save(message);
  }

  async getMessages(chatId: string) {
    const messages = await this.messageRepoService.findByChatId(chatId);
    return messages.map(
      (message) =>
        message.sender && {
          ...message,
          sender: '@' + message.sender.username,
        },
    );
  }
}
