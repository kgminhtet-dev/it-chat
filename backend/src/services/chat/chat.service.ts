import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '../../types/message';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { ChatRepoService } from '../repository/Chat/chat-repo.service';
import { MessageRepoService } from '../repository/Message/message-repo.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly accountRepoService: AccountRepoService,
    private readonly chatRepoSerivce: ChatRepoService,
    private readonly messageRepoService: MessageRepoService,
  ) {}

  private generateUUID() {
    return uuidv4();
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

  async getAccounts(usernames: string[]) {
    usernames = usernames.map((username) => username.slice(1));
    const accounts = await this.accountRepoService.findAll(usernames);
    return accounts.map((account) => ({
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
    }));
  }

  createMessage(sender: string, chatId: string, content: string): IMessage {
    return {
      id: this.generateUUID(),
      content,
      sender,
      chatId: chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  saveMessage(message: IMessage) {
    return this.messageRepoService.save(message);
  }

  async getChatIdsOf(accountId: string) {
    return this.chatRepoSerivce.findIdsByAccountId(accountId);
  }

  async createChat(chatId: string, participants: string[]) {
    const chat = await this.chatRepoSerivce.create(chatId, participants);
    return chat;
  }
}
