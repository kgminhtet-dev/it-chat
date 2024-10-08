import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '../../types/message';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { ChatRepoService } from '../repository/Chat/chat-repo.service';
import { MessageRepoService } from '../repository/Message/message-repo.service';
import { Chat, Message } from '../repository/entities/entities';

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

  private transformChat(account_id: string, chat: Chat) {
    const members = chat.members.map((account) => ({
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
      isDeactivated: account.isDeactivated,
    }));
    const contact = members.filter((member) => member.id !== account_id)[0];

    return {
      id: chat.id,
      name: chat.name,
      isActive: chat.isActive,
      members,
      contact,
      lastMessage: chat.lastMessage,
      lastChatTime: chat.lastChatTime,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  private transformMessage(message: Message) {
    return {
      id: message.id,
      content: message.content,
      sender: message.sender.id,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async createChat(chatId: string, participants: string[]) {
    return this.chatRepoService.create(chatId, participants);
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

  async getChatIdListOf(accountId: string) {
    return this.chatRepoService.findIdsByAccountId(accountId);
  }

  async getChatOf(accountId: string, chatId: string) {
    const chat = await this.chatRepoService.findById(chatId);
    if (!chat) return { chat: null, message: [] };

    const messages = chat.messages;
    return {
      chat: this.transformChat(accountId, chat),
      messages: messages.map((message) => this.transformMessage(message)),
    };
  }

  async getChatsOf(accountId: string) {
    const account = await this.accountRepoService.findById(accountId, {
      chats: true,
    });
    return account.chats.map((chat) => this.transformChat(account.id, chat));
  }

  async getMessagesOf(chatId: string) {
    const messages = await this.messageRepoService.findByChatId(chatId, {
      order: 'ASC',
    });
    return messages.map((message) => this.transformMessage(message));
  }

  async getMembers(member_ids: string[]) {
    const accounts = await this.accountRepoService.findAll(member_ids);
    return accounts.map((account) => ({
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
    }));
  }

  async saveMessage(message: IMessage) {
    const chat = await this.chatRepoService.findById(message.chatId);
    if (!chat.isActive)
      return { error: 'Account is deactivated.', message: null };

    chat.lastMessage = message.content;
    chat.lastChatTime = message.createdAt;
    await this.chatRepoService.update(chat.id, {
      lastMessage: message.content,
      lastChatTime: message.createdAt,
    });

    const savedMessage = await this.messageRepoService.save(chat, message);
    return { error: null, message: this.transformMessage(savedMessage) };
  }

  async updateIsActive(accountId: string, isActive: boolean) {
    const chatIds = await this.getChatIdListOf(accountId);
    const updatedResult = await this.chatRepoService.updateIsActive(
      chatIds,
      isActive,
    );
    return updatedResult.affected > 0;
  }

  async deleteMessage(chatId: string, messageId: string) {
    const deletedMessage = await this.messageRepoService.delete(messageId);
    if (deletedMessage.affected === 0) return false;

    const messages = await this.messageRepoService.findByChatId(chatId, {
      order: 'asc',
    });
    const latestMessage = messages[messages.length - 1];
    const updatedChat = await this.chatRepoService.update(chatId, {
      lastMessage: latestMessage.content,
      lastChatTime: latestMessage.createdAt,
    });

    if (updatedChat.affected === 0) return false;

    return messages.map((message) => this.transformMessage(message));
  }
}
