import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserProfileService {
  constructor(private accountRepoService: AccountRepoService) {}

  async update(username: string, params: UpdateUserDto) {
    if (params.fullname) return this.changeName(username, params.fullname);
    if (params.email) return this.changeEmail(username, params.email);
    if (params.username) return this.changeUsername(username, params.username);
    throw new BadRequestException('Invalid data.');
  }

  async getProfile(username: string) {
    if (username[0] !== '@') {
      throw new BadRequestException('Username must start with "@"');
    }
    const account = await this.accountRepoService.findByUsername(
      username.slice(1),
    );
    if (!account || account.isDeactivated) {
      throw new NotFoundException(`User not found.`);
    }

    return {
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
    };
  }

  async getAccountById(id: string) {
    const account = await this.accountRepoService.findById(id, true);
    if (!account) {
      throw new NotFoundException(`User not found.`);
    }

    const chats = account.chats.map((chat) => {
      const contact = chat.accounts.filter(
        (member) => account.username != member.username,
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

    return {
      profile: {
        id: account.id,
        fullname: account.fullname,
        username: '@' + account.username,
        email: account.email,
      },
      chats,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async changeName(id: string, fullname: string) {
    const updateAccount = await this.accountRepoService.update(id, {
      fullname,
    });

    if (updateAccount.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: 'Name is successfully changed.',
    };
  }

  async changeEmail(id: string, email: string) {
    const updateAccount = await this.accountRepoService.update(id, {
      email,
    });

    if (updateAccount.affected === 0)
      throw new InternalServerErrorException(
        '[change email] something went wrong.',
      );

    return {
      message: 'Email is successfully changed.',
    };
  }

  async changeUsername(id: string, newUsername: string) {
    const updatedResult = await this.accountRepoService.update(id, {
      username: newUsername,
    });

    if (updatedResult.affected === 0)
      throw new InternalServerErrorException(
        '[change username] something went wrong.',
      );

    return {
      message: 'Username is successfully changed.',
    };
  }

  async changePassword(id: string, params: any) {
    if (params.currentPassword || params.newPassword)
      throw new BadRequestException('Password is required to change.');

    const { currentPassword, newPassword } = params;

    if (currentPassword === newPassword)
      throw new BadRequestException(
        'Current password and new password are same.',
      );

    const account = await this.accountRepoService.findById(id);

    if (account.password === currentPassword)
      throw new BadRequestException('Current password is not correct.');

    const updatedAccount = await this.accountRepoService.update(id, {
      password: newPassword,
    });

    if (updatedAccount.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: 'Password is successfully changed.',
    };
  }

  async deactivate(id: string) {
    const account = await this.accountRepoService.findById(id);
    if (account.isDeactivated)
      throw new BadRequestException('Account is already deactivated.');

    const deactivateResult = await this.accountRepoService.deactivate(id);

    if (deactivateResult.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: `${account.fullname} is deactivated successfully.`,
    };
  }

  async activate(id: string) {
    const account = await this.accountRepoService.findById(id);
    if (!account.isDeactivated)
      throw new BadRequestException('Account is already activated.');

    const updatedResult = await this.accountRepoService.activate(id);

    if (updatedResult.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: `${account.fullname} is activated successfully.`,
    };
  }
}
