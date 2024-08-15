import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { ActionDto } from './dto/action.dto';

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
  @Get('accounts/:accountId/chats/:chatId/messages')
  async getMessages(
    @Req() request: Request & { payload: IPayload },
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getMessages(chatId);
  }

  @UseGuards(AuthGuard)
  @Get('accounts')
  async getAccount(
    @Req() request: Request & { payload: IPayload },
    @Query('kind') kind: string,
    @Query('username') username: string,
  ) {
    if (kind === 'profile')
      return this.userService.getAccountById(request.payload.sub);
    if (username) return this.userService.getProfile(username);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('accounts/:accountId')
  async updateAccount(
    @Body() data: UpdateUserDto,
    @Req() request: Request & { payload: IPayload },
  ) {
    return this.userService.update(request.payload.sub, data);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('accounts/:accountId/actions')
  async handleActions(
    @Body() actionDto: ActionDto,
    @Req() request: Request & { payload: IPayload },
  ) {
    switch (actionDto.action) {
      case 'deactivate':
        return this.userService.deactivate(request.payload.sub);
      default:
        throw new BadRequestException(
          `${actionDto.action} is invalid method name.`,
        );
    }
  }
}
