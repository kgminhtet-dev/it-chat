import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepoService } from '../repository/Account/account-repo.service';

@Injectable()
export class UserProfileService {
  constructor(private accountRepoService: AccountRepoService) {}

  async update(username: string, params: any) {
    if (params.fullname) return this.changeName(username, params.fullname);
    if (params.email) return this.changeEmail(username, params.email);
    if (params.username) return this.changeUsername(username, params.username);
  }

  async getProfile(username: string) {
    const account = await this.accountRepoService.findByUsername(
      username,
      true,
    );
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
          username: contact.username,
          fullname: contact.fullname,
        },
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    return {
      profile: {
        id: account.id,
        fullname: account.fullname,
        username: account.username,
        email: account.email,
      },
      chats,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async getAccount(username: string) {
    const account = await this.accountRepoService.findByUsername(username);
    if (account)
      return {
        id: account.id,
        fullname: account.fullname,
        username: account.username,
      };
    throw new NotFoundException(`User not found.`);
  }

  async changeName(username: string, fullname: string) {
    const updateAccount = await this.accountRepoService.update(username, {
      fullname,
    });

    if (updateAccount.affected === 0)
      throw new InternalServerErrorException(
        '[change name] something went wrong.',
      );

    return {
      message: 'Name is changed successfully.',
    };
  }

  async changeEmail(username: string, email: string) {
    const updateAccount = await this.accountRepoService.update(username, {
      email,
    });

    if (updateAccount.affected === 0)
      throw new InternalServerErrorException(
        '[change email] something went wrong.',
      );

    return {
      message: 'Email is changed successfully.',
    };
  }

  async changeUsername(username: string, newUsername: string) {
    const updatedResult = await this.accountRepoService.update(username, {
      username: newUsername,
    });

    if (updatedResult.affected === 0)
      throw new InternalServerErrorException(
        '[change username] something went wrong.',
      );

    return {
      message: 'Username is changed successfully.',
    };
  }

  async changePassword(username: string, params: any) {
    if (params.oldPassword || params.newPassword)
      throw new BadRequestException('Password is required to change.');

    const { oldPassword, newPassword } = params;

    const account = await this.accountRepoService.findByUsername(username);

    if (account.password === oldPassword)
      throw new BadRequestException(
        'Old password and new password do not match.',
      );

    const updatedAccount = await this.accountRepoService.update(username, {
      password: newPassword,
    });

    if (updatedAccount.affected === 0)
      throw new InternalServerErrorException(
        '[change password] something went wrong.',
      );

    return {
      message: 'Password is changed successfully.',
    };
  }

  async deactivate(username: string) {
    const account = await this.accountRepoService.findByUsername(username);
    if (account.isDeactivated)
      throw new BadRequestException('Account is already deactivated.');

    const deactivateResult =
      await this.accountRepoService.deactivateAccount(username);

    if (deactivateResult.affected === 0)
      throw new InternalServerErrorException(
        '[deactivate] something went wrong.',
      );

    return {
      message: `${username} is deactivated successfully.`,
    };
  }

  async activate(username: string) {
    const account = await this.accountRepoService.findByUsername(username);
    if (!account.isDeactivated)
      throw new BadRequestException('Account is already activated.');

    const updatedResult =
      await this.accountRepoService.activateAccount(username);

    if (updatedResult.affected === 0)
      throw new InternalServerErrorException(
        '[activate] something went wrong.',
      );

    return {
      message: `${username} is activated successfully.`,
    };
  }
}
