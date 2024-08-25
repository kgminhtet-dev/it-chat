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
    private readonly chatRepoService: ChatRepoService,
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
    return this.chatRepoService.findIdsByAccountId(accountId);
  }

  async getChatOf(accountId: string, chatId: string) {
    const chat = await this.chatRepoService.findById(chatId);
    const participants = chat.accounts.map((accont) => ({
      id: accont.id,
      fullname: accont.fullname,
      username: accont.username,
    }));
    const contact = participants.filter(
      (participant) => participant.id !== accountId,
    )[0];
    return {
      id: chat.id,
      name: chat.name,
      participants,
      contact,
      lastMessage: chat.lastMessage,
      lastChatTime: chat.lastChatTime,
    };
  }

  async getChatsOf(accountId: string) {
    const account = await this.accountRepoService.findById(accountId, {
      chats: true,
    });
    return account.chats.map((chat) => {
      const contact = chat.accounts.filter(
        (member) => accountId != member.id,
      )[0];
      return {
        id: chat.id,
        name: chat.name,
        lastMessage: chat.lastMessage,
        lastChatTime: chat.lastChatTime,
        contact: {
          id: contact.id,
          username: '@' + contact.username,
          fullname: contact.fullname,
          isDeactivated: contact.isDeactivated,
        },
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
  }

  async createChat(chatId: string, participants: string[]) {
    return this.chatRepoService.create(chatId, participants);
  }
}
