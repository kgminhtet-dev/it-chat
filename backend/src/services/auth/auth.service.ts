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
      account_id: account.id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signin(email: string, password: string) {
    const account = await this.accountRepoService.findByEmail(email);
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
      account_id: account.id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signout(id: string) {
    return {
      message: 'Successfully signout.',
    };
  }

  private toRespChats(account: IAccount, chats: IChat[]) {
    return chats.map((chat) => {
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
  }
}
