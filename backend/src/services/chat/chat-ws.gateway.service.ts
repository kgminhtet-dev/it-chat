import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { ChatRepoService } from '../repository/Chat/chat-repo.service';
import { MessageRepoService } from '../repository/Message/message-repo.service';
import { IMessage } from '../../types/message';

@Injectable()
export class ChatWsGatewayService {
  constructor(
    private readonly accountRepoService: AccountRepoService,
    private readonly chatRepoSerivce: ChatRepoService,
    private readonly messageRepoService: MessageRepoService,
  ) {}

  getUUID4() {
    return uuidv4();
  }

  getAccounts(usernames: string[]) {
    return this.accountRepoService.findAll(usernames);
  }

  createMessage(sender: string, chatId: string, content: string): IMessage {
    return {
      id: this.getUUID4(),
      content,
      sender,
      chat: chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  saveMessage(message: IMessage) {
    return this.messageRepoService.save(message);
  }

  async getChatIds(username: string) {
    return this.chatRepoSerivce.findIdsByUsername(username);
  }

  async creatChat(chatId: string, participants: string[]) {
    return this.chatRepoSerivce.create(chatId, participants);
  }
}
