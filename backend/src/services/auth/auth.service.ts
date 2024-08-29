import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountRepoService } from '../repository/Account/account-repo.service';
import { SignupDto } from './dto/signup.dto';
import { IChat } from '../../types/chat';
import { IAccount } from '../../types/account';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepoService: AccountRepoService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    let isExistAccount = await this.accountRepoService.findByEmail(
      signupDto.email,
    );
    if (isExistAccount) {
      throw new BadRequestException(`Email ${signupDto.email} already exist`);
    }

    isExistAccount = await this.accountRepoService.findByUsername(
      signupDto.username,
    );
    if (isExistAccount) {
      throw new BadRequestException(
        `Username ${signupDto.username} already exist`,
      );
    }

    const salt = await bcrypt.genSalt();
    const password = signupDto.password;
    const hash = await bcrypt.hash(password, salt);
    const account = await this.accountRepoService.create({
      ...signupDto,
      password: hash,
    });
    const payload = { sub: account.id, username: account.username };
    return {
      account: this.transformAccount(account),
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signin(email: string, password: string) {
    const account = await this.accountRepoService.findByEmail(email, true);
    if (!account) {
      throw new UnauthorizedException(`Incorrect email.`);
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new UnauthorizedException(`Incorrect password.`);
    }

    if (account.isDeactivated) this.accountRepoService.activate(account.id);

    const payload = { sub: account.id, username: account.username };
    return {
      account: this.transformAccount(account),
      chats: this.transformChats(account, account.chats),
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signout() {
    return {
      message: 'Successfully signout.',
    };
  }

  private transformAccount(account: IAccount) {
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
        lastMessage: chat.lastMessage,
        lastChatTime: chat.lastChatTime,
        members,
        contact,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
  }
}
