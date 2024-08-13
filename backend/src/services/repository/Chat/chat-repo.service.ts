import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/entities';
import { AccountRepoService } from '../Account/account-repo.service';

@Injectable()
export class ChatRepoService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly accountRepoService: AccountRepoService,
  ) {}

  async findById(id: string) {
    return this.chatRepository.findOne({
      where: { id },
    });
  }

  async findIdsByUsername(username: string) {
    const chats = await this.chatRepository.find({
      select: {
        id: true,
      },
      where: {
        accounts: {
          username: username,
        },
      },
    });
    return chats.map((chat: Chat) => chat.id);
  }

  async create(id: string, members: string[], name = '') {
    const accounts = await this.accountRepoService.findAll(members);
    const newChat = this.chatRepository.create({
      id,
      name,
      accounts,
    });

    return this.chatRepository.save(newChat);
  }

  async save(chat: Chat) {
    return this.chatRepository.save(chat);
  }

  async update(id: string, chat: Chat) {
    return this.chatRepository.update(id, chat);
  }
}
