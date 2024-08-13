import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { UserProfileService } from './services/user-profile/user-profile.service';
import { ChatService } from './services/chat/chat.service';
import { FriendService } from './services/friend/friend.service';
import { NotificationService } from './services/notification/notification.service';
import { IPayload } from './types/payload';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserProfileService,
    private readonly chatService: ChatService,
    private readonly friendService: FriendService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  welcome(): string {
    return this.appService.welcome();
  }

  @Post('auth/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() data: SigninDto) {
    return this.authService.signin(data.email, data.password);
  }

  @Post('auth/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async signout(@Req() request: Request & { payload: IPayload }) {
    return this.authService.signout(request.payload.username);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId')
  async getAccount(@Req() request: Request & { payload: IPayload }) {
    return this.userService.getAccount(request.payload.username);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/chats/:chatId/messages')
  async getMessages(
    @Req() request: Request & { payload: IPayload },
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getMessages(chatId);
  }

  @UseGuards(AuthGuard)
  @Get('accounts')
  async searchAccount(
    @Req() request: Request & { payload: IPayload },
    @Query('kind') kind: string,
  ) {
    if (kind === 'profile')
      return this.userService.getProfile(request.payload.username);
    return this.userService.getAccount(request.payload.username);
  }

  @UseGuards(AuthGuard)
  @Post('accounts/:accountId')
  async updateAccount(
    @Req() request: Request & { payload: IPayload },
    @Body() data: unknown,
  ) {
    return this.userService.update(request.payload.username, data);
  }
}
