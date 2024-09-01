import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IChat } from 'src/types/chat';
import { Raw, Repository } from 'typeorm';
import { IMessage } from '../../../types/message';
import { AccountRepoService } from '../Account/account-repo.service';
import { ChatRepoService } from '../Chat/chat-repo.service';
import { Message } from '../entities/entities';

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

  async save(chat: IChat, message: IMessage) {
    const sender = await this.accountRepoService.findById(message.sender);
    return this.messageRepository.save({
      id: message.id,
      content: message.content,
      sender,
      chat,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
  }

  findByChatId(
    chatId: string,
    { order, take }: { order: 'ASC' | 'DESC' | 'asc' | 'desc'; take?: number },
  ) {
    return this.messageRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        sender: true,
      },
      order: {
        createdAt: order,
      },
    });
  }

  update(id: string, message: unknown) {
    return this.messageRepository.update(id, message);
  }

  delete(id: string) {
    return this.messageRepository.delete(id);
  }
}
