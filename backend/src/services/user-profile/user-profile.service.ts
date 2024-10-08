import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAccount } from '../../types/account';
import { IChat } from '../../types/chat';
import { ChatService } from '../chat/chat.service';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { IChangePassword } from '../repository/Account/dto/change-password';
import { FriendRequestRepoService } from '../repository/FriendRequest/friendRequest-repo.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly accountRepoService: AccountRepoService,
    private readonly friendRequestRepoService: FriendRequestRepoService,
    private readonly chatService: ChatService,
  ) {}

  private transformAccount(account: IAccount, email = false) {
    if (email)
      return {
        id: account.id,
        fullname: account.fullname,
        username: '@' + account.username,
        email: account.email,
        isDeactivated: account.isDeactivated,
      };

    return {
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
      isDeactivated: account.isDeactivated,
    };
  }

  private transformChats(account: IAccount, chats: IChat[]) {
    if (chats.length === 0) return [];

    return chats.map((chat) => {
      const members = chat.members.map((member) => ({
        id: member.id,
        fullname: member.fullname,
        username: '@' + member.username,
        isDeactivated: member.isDeactivated,
      }));
      const contact = members.filter((member) => account.id !== member.id)[0];
      return {
        id: chat.id,
        name: chat.name,
        isActive: chat.isActive,
        lastMessage: chat.lastMessage,
        lastChatTime: chat.lastChatTime,
        members,
        contact,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
  }

  async update(id: string, params: UpdateUserDto) {
    if (params.fullname) return this.changeName(id, params.fullname);
    if (params.email) return this.changeEmail(id, params.email);
    if (params.username) return this.changeUsername(id, params.username);
    if (params.currentPassword && params.newPassword)
      return this.changePassword(id, params);
    throw new BadRequestException('Invalid data.');
  }

  async getAccount(id: string) {
    const account = await this.accountRepoService.findById(id);
    if (!account) {
      throw new NotFoundException(`User not found.`);
    }

    return {
      account: this.transformAccount(account, true),
    };
  }

  async getAccountIncludedChats(id: string) {
    const account = await this.accountRepoService.findById(id, { chats: true });
    if (!account) {
      throw new NotFoundException(`User not found.`);
    }

    return {
      account: this.transformAccount(account, true),
      chats: this.transformChats(account, account.chats),
    };
  }

  async getFriend(accountId: string, friendId: string) {
    const friends = await this.getFriendList(accountId);
    const friend = friends.find((f) => f.id === friendId);
    if (!friend) throw new NotFoundException(`User not found.`);
    return friend;
  }

  async search(username: string) {
    if (username[0] !== '@')
      throw new BadRequestException("Username must start with '@'.");
    const account = await this.accountRepoService.findByUsername(
      username.slice(1),
    );

    if (!account || account.isDeactivated)
      throw new NotFoundException(`User not found.`);

    return {
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
    };
  }

  async getFriendList(id: string) {
    const account = await this.accountRepoService.findById(id, {
      friends: true,
    });
    return account.friends
      .filter((friend) => !friend.isDeactivated)
      .map((friend) => ({
        id: friend.id,
        fullname: friend.fullname,
        username: '@' + friend.username,
      }));
  }

  async getFriendRequestPendings(id: string) {
    try {
      const friendRequests =
        await this.friendRequestRepoService.findAllSentRequest(id);
      if (friendRequests.length === 0) return [];
      return friendRequests.map((friendRequest) => ({
        id: friendRequest.id,
        status: friendRequest.status,
        receiver: {
          id: friendRequest.receiver.id,
          fullname: friendRequest.receiver.fullname,
          username: friendRequest.receiver.username,
        },
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'InternalServerError',
        error.toString(),
      );
    }
  }

  async getFriendRequests(id: string) {
    try {
      const friendRequests =
        await this.friendRequestRepoService.findAllReceivedRequest(id);
      if (friendRequests.length === 0) return [];
      return friendRequests.map((friendRequest) => ({
        id: friendRequest.id,
        status: friendRequest.status,
        sender: {
          id: friendRequest.sender.id,
          fullname: friendRequest.sender.fullname,
          username: friendRequest.sender.username,
        },
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'InternalServerError',
        error.toString(),
      );
    }
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
    const alreadyExist = await this.accountRepoService.findByEmail(email);
    if (alreadyExist) throw new BadRequestException('Email already exists.');

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
    if (newUsername[0] !== '@')
      throw new BadRequestException('Username must start with "@".');

    const account = await this.accountRepoService.findByUsername(newUsername);
    if (account) {
      throw new BadRequestException('Username is already taken.');
    }

    const updatedResult = await this.accountRepoService.update(id, {
      username: newUsername.slice(1),
    });

    if (updatedResult.affected === 0)
      throw new InternalServerErrorException(
        '[change username] something went wrong.',
      );

    return {
      message: 'Username is successfully changed.',
    };
  }

  async changePassword(id: string, params: IChangePassword) {
    const { currentPassword, newPassword } = params;

    if (currentPassword === newPassword)
      throw new BadRequestException(
        'Current password and new password are same.',
      );

    const account = await this.accountRepoService.findById(id);
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      throw new UnauthorizedException(`Current password is not correct.`);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);
    const updatedAccount = await this.accountRepoService.update(id, {
      password: hash,
    });

    if (updatedAccount.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    return {
      message: 'Password is successfully changed.',
    };
  }

  async deactivate(id: string) {
    const deactivateResult = await this.accountRepoService.deactivate(id);

    if (deactivateResult.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    const ok = await this.chatService.updateIsActive(id, false);
    if (!ok) throw new InternalServerErrorException('Something went wrong.');

    return {
      message: 'Successfully deactivated.',
    };
  }

  async activate(id: string) {
    const activateResult = await this.accountRepoService.activate(id);

    if (activateResult.affected === 0)
      throw new InternalServerErrorException('Something went wrong.');

    const ok = await this.chatService.updateIsActive(id, true);
    if (!ok) throw new InternalServerErrorException('Something went wrong.');

    return { message: 'Successfully activated.' };
  }

  async sendRequest(senderId: string, receiverName: string) {
    const sender = await this.accountRepoService.findById(senderId, {
      friends: true,
    });
    if (!sender) throw new NotFoundException('Invalid account.');

    if (sender.username === receiverName)
      throw new BadRequestException("Can't add yourself.");

    const receiver = await this.accountRepoService.findByUsername(receiverName);
    if (!receiver)
      throw new NotFoundException(`User with ${receiverName} not found.`);

    const pendings = await this.getFriendRequestPendings(sender.id);
    const isAlreadyPending = pendings.find(
      (pending) => pending.receiver.username === receiverName,
    );
    if (isAlreadyPending)
      throw new BadRequestException(`You've already sent friend-request`);

    const isFriend = sender.friends.find(
      (friend) => friend.username === receiverName,
    );
    if (isFriend) throw new BadRequestException("You're already friend.");

    try {
      await this.friendRequestRepoService.createFriendRequest(sender, receiver);
      return { message: 'Successfully Send Friend Request.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal Server Error',
        error.toString(),
      );
    }
  }

  async cancelRequest(friendRequestId: string) {
    try {
      const DeleteResult =
        await this.friendRequestRepoService.remove(friendRequestId);
      if (DeleteResult.affected === 1)
        return { message: 'Canceled friend request.' };
      return { message: 'Invalid friend request.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async rejectRequest(friendRequestId: string) {
    try {
      const DeleteResult =
        await this.friendRequestRepoService.remove(friendRequestId);
      if (DeleteResult.affected === 1)
        return { message: 'Rejected friend request.' };
      return { message: 'Invalid friend request.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async confirmRequest(friendRequestId: string) {
    try {
      await this.addFriend(friendRequestId);
      await this.friendRequestRepoService.remove(friendRequestId);
      return { message: "You're now friend." };
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async addFriend(friendRequestId: string) {
    const friendRequest =
      await this.friendRequestRepoService.findById(friendRequestId);
    if (!friendRequest)
      throw new NotFoundException('Not found friend request.');

    const { sender, receiver } = friendRequest;

    sender.friends.push(receiver);
    receiver.friends.push(sender);
    await this.accountRepoService.save(receiver);
    await this.accountRepoService.save(sender);
    return true;
  }

  async removeFriend(accountId: string, friendId: string) {
    const account = await this.accountRepoService.findById(accountId, {
      friends: true,
    });
    if (!account) throw new NotFoundException('Account does not exist.');

    const friend = await this.accountRepoService.findById(friendId, {
      friends: true,
    });
    if (!friend) throw new NotFoundException('Friend does not exist.');

    account.friends = account.friends.filter(
      (friend) => friend.id !== friendId,
    );

    friend.friends = friend.friends.filter(
      (account) => account.id !== accountId,
    );
    try {
      await this.accountRepoService.save(friend);
      await this.accountRepoService.save(account);
      return {
        message: 'Successfully unfriend.',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
