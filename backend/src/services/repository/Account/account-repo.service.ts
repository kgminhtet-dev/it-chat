import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/entities';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountRepoService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findAll(usernames?: string[]): Promise<Account[]> {
    if (!usernames) return this.accountRepository.find();
    return this.accountRepository.find({
      where: usernames.map((username) => ({ username })),
    });
  }

  findByEmail(email: string, chats = false) {
    if (chats)
      return this.accountRepository.findOne({
        where: {
          email,
        },
        relations: {
          chats: {
            accounts: true,
          },
        },
        order: {
          chats: {
            lastChatTime: 'desc',
          },
        },
      });
    return this.accountRepository.findOne({
      where: { email },
    });
  }

  findByUsername(username: string, chats?: boolean) {
    if (chats) {
      return this.accountRepository.findOne({
        where: {
          username,
        },
        relations: {
          chats: {
            accounts: true,
          },
        },
        order: {
          chats: {
            lastChatTime: 'desc',
          },
        },
      });
    }

    return this.accountRepository.findOne({
      where: {
        username,
      },
    });
  }

  create(createAccountDto: CreateAccountDto) {
    const newUser = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(newUser);
  }

  update(username: string, updateAccountDto: UpdateAccountDto) {
    return this.accountRepository.update({ username }, updateAccountDto);
  }

  deactivateAccount(username: string) {
    return this.accountRepository.update(username, {
      isDeactivated: true,
    });
  }

  activateAccount(username: string) {
    return this.accountRepository.update(username, {
      isDeactivated: false,
    });
  }
}
