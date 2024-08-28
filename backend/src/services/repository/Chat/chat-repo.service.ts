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

  async findById(id: string, members = false) {
    if (members) {
      return this.chatRepository.findOne({
        where: { id },
        relations: {
          members: true,
        },
      });
    }
    return this.chatRepository.findOne({
      where: { id },
    });
  }

  async findIdsByAccountId(accountId: string) {
    const account = await this.accountRepoService.findById(accountId, {
      chats: true,
    });
    return account.chats.map((chat: Chat) => ({ id: chat.id }));
  }

  async create(id: string, members: string[], name = '') {
    members = members.map((member) => member.slice(1));
    const accounts = await this.accountRepoService.findAll(members);
    const newChat = this.chatRepository.create({
      id,
      name,
      members: accounts,
    });

    return this.chatRepository.save(newChat);
  }

  async update(id: string, chat: Chat) {
    return this.chatRepository.update(id, chat);
  }
}
