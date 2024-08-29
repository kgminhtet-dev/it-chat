import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/entities';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IFindOption } from './dto/find-option';

@Injectable()
export class AccountRepoService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findAll(ids: string[]): Promise<Account[]> {
    return this.accountRepository.find({
      where: ids.map((id) => ({ id })),
    });
  }

  findByEmail(email: string, chatRelation = false) {
    if (chatRelation)
      return this.accountRepository.findOne({
        where: { email },
        relations: {
          chats: {
            members: true,
          },
        },
      });
    return this.accountRepository.findOne({
      where: { email },
    });
  }

  findByUsername(username: string) {
    return this.accountRepository.findOne({
      where: {
        username,
      },
    });
  }

  findIncludeWithChats(id: string) {
    return this.accountRepository.findOne({
      where: {
        id,
      },
      relations: {
        chats: {
          members: true,
        },
      },
      order: {
        chats: {
          lastChatTime: 'DESC',
        },
      },
    });
  }

  findIncludeWithFriends(id: string) {
    return this.accountRepository.findOne({
      where: { id },
      relations: {
        friends: true,
      },
      order: {
        fullname: 'ASC',
      },
    });
  }

  findIncludeWithFriendsAndChat(id: string) {
    return this.accountRepository.findOne({
      where: {
        id,
      },
      relations: {
        friends: true,
        chats: {
          members: true,
        },
      },
      order: {
        friends: 'ASC',
        chats: {
          lastChatTime: 'DESC',
        },
      },
    });
  }

  findById(id: string, options: IFindOption = null) {
    if (!options) return this.accountRepository.findOne({ where: { id } });

    if (options.chats) return this.findIncludeWithChats(id);

    if (options.friends) return this.findIncludeWithFriends(id);

    if (options.friends && options.chats)
      return this.findIncludeWithFriendsAndChat(id);
  }

  findFriend(friendId: string) {
    return this.accountRepository.findOne({
      where: {
        friends: {
          id: friendId,
        },
      },
    });
  }

  create(createAccountDto: CreateAccountDto) {
    const newUser = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(newUser);
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountRepository.update({ id }, updateAccountDto);
  }

  save(account: Account) {
    return this.accountRepository.save(account);
  }

  deactivate(id: string) {
    return this.accountRepository.update(
      { id },
      {
        isDeactivated: true,
      },
    );
  }

  activate(id: string) {
    return this.accountRepository.update(
      { id },
      {
        isDeactivated: false,
      },
    );
  }
}
