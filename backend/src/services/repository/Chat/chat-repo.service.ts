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

  async findById(id: string, accountRelation = false) {
    if (accountRelation) {
      return this.chatRepository.findOne({
        where: { id },
        relations: {
          accounts: true,
        },
      });
    }
    return this.chatRepository.findOne({
      where: { id },
    });
  }

  async findIdsByAccountId(accountId: string) {
    const chats = await this.chatRepository.find({
      select: {
        id: true,
      },
      where: {
        accounts: {
          id: accountId,
        },
      },
    });
    return chats.map((chat: Chat) => chat.id);
  }

  async create(id: string, members: string[], name = '') {
    members = members.map((member) => member.slice(1));
    const accounts = await this.accountRepoService.findAll(members);
    const newChat = this.chatRepository.create({
      id,
      name,
      accounts,
    });

    return this.chatRepository.save(newChat);
  }

  async update(id: string, chat: Chat) {
    return this.chatRepository.update(id, chat);
  }
}
