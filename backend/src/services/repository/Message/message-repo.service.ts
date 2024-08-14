import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Message } from '../entities/entities';
import { AccountRepoService } from '../Account/account-repo.service';
import { ChatRepoService } from '../Chat/chat-repo.service';
import { IMessage } from '../../../types/message';

@Injectable()
export class MessageRepoService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly accountRepoService: AccountRepoService,
    private readonly chatRepoService: ChatRepoService,
  ) {}

  findById(id: string) {
    return this.messageRepository.findOne({
      where: { id },
      relations: {
        sender: true,
      },
    });
  }

  async findAllBetweenDates(chadId: string, startDate?: Date, endDate?: Date) {
    return this.messageRepository.find({
      where: {
        chat: {
          id: chadId,
        },
        createdAt: Raw((alias) => `${alias} BETWEEN :startDate AND :endDate`, {
          startDate,
          endDate,
        }),
      },
    });
  }

  async save(message: IMessage) {
    const chat = await this.chatRepoService.findById(message.chat);
    chat.lastMessage = message.content;
    chat.lastChatTime = message.createdAt;
    const account = await this.accountRepoService.findByUsername(
      message.sender.slice(1),
    );
    await this.chatRepoService.update(chat.id, chat);
    return this.messageRepository.save({
      id: message.id,
      content: message.content,
      sender: account,
      chat,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
  }

  findByChatId(chatId: string) {
    return this.messageRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        sender: true,
      },
    });
  }

  update(id: string, message: unknown) {
    return this.messageRepository.update(id, message);
  }
}
