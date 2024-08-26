import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { NotificationService } from './services/notification/notification.service';
import { IPayload } from './types/payload';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActionDto } from './dto/action.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserProfileService,
    private readonly chatService: ChatService,
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
  @Get('accounts/:accountId/chats')
  async getChats(@Req() request: Request & { payload: IPayload }) {
    console.log('id ', request.payload);
    return this.chatService.getChatsOf(request.payload.sub);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/chats/:chatId')
  async getChat(
    @Req() request: Request & { payload: IPayload },
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChatOf(request.payload.sub, chatId);
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
  async searchUsername(@Query('username') username: string) {
    if (username) {
      return this.userService.search(username);
    }
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId')
  async getAccountById(@Req() request: Request & { payload: IPayload }) {
    return this.userService.getAccountById(request.payload.sub);
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
    @Body() { action }: ActionDto,
    @Req() request: Request & { payload: IPayload },
  ) {
    switch (action) {
      case 'deactivate':
        return this.userService.deactivate(request.payload.sub);
      default:
        throw new BadRequestException(`${action} is invalid method name.`);
    }
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friends')
  async listFriends(@Param('accountId') accountId: string) {
    return this.userService.getFriendList(accountId);
  }

  @UseGuards(AuthGuard)
  @Delete('accounts/:accountId/friends/:friendId')
  async unFriend(
    @Param('accountId') accountId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(accountId, friendId);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friend-requests/pendings')
  async getFriendRequestPendings(@Param('accountId') accountId: string) {
    return this.userService.getFriendRequestPendings(accountId);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friend-requests')
  async getFriendRequests(@Param('accountId') accountId: string) {
    return this.userService.getFriendRequests(accountId);
  }

  @UseGuards(AuthGuard)
  @Post('accounts/:accountId/friend-requests')
  async sentFriendRequest(
    @Req() request: Request & { payload: IPayload },
    @Param('accountId') accountId: string,
    @Body() { friendName }: { friendName: string },
  ) {
    return this.userService.sendRequest(accountId, friendName);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('accounts/:accountId/friend-requests/:requestId')
  async handleFriendRequest(
    @Param('requestId') requestId: string,
    @Body() { requestName }: FriendRequestDto,
  ) {
    if (!requestId)
      throw new BadRequestException('undefined friend request id.');
    switch (requestName) {
      case 'cancel friend request':
        return this.userService.cancelRequest(requestId);
      case 'reject friend request':
        return this.userService.rejectRequest(requestId);
      case 'confirm friend request':
        return this.userService.confirmRequest(requestId);
      default:
        throw new BadRequestException(`Invalid method name ${requestName}`);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/accounts/:accountId/friends/:friendId')
  async removeFriend(
    @Param('accountId') accountId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(accountId, friendId);
  }
}
