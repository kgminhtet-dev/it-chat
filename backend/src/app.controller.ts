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
  async signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async signout() {
    return this.authService.signout();
  }

  // api/accounts/:accountId
  @UseGuards(AuthGuard)
  @Get('accounts/:accountId')
  async getAccount(
    @Req() request: Request & { payload: IPayload },
    @Query('include') include: string,
  ) {
    // if (include !== 'chats')
    // return this.userService.getAccount(request.payload.sub);
    return this.userService.getAccountIncludedChats(request.payload.sub);
  }

  // api/accounts/:accountId/chats
  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/chats')
  async getChatList(@Req() request: Request & { payload: IPayload }) {
    return this.chatService.getChatsOf(request.payload.sub);
  }

  // api/accounts/:accountId/chats/:chatId
  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/chats/:chatId')
  async getChat(
    @Req() request: Request & { payload: IPayload },
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getChatOf(request.payload.sub, chatId);
  }

  @UseGuards(AuthGuard)
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
  @Get('accounts/:accountId/chats/:chatId/messages')
  async getMessages(
    @Req() request: Request & { payload: IPayload },
    @Param('chatId') chatId: string,
  ) {
    return this.chatService.getMessagesOf(chatId);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friends')
  async listFriends(@Req() request: Request & { payload: IPayload }) {
    return this.userService.getFriendList(request.payload.sub);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friend-requests/pendings')
  async getFriendRequestPendings(
    @Req() request: Request & { payload: IPayload },
  ) {
    return this.userService.getFriendRequestPendings(request.payload.sub);
  }

  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/friend-requests')
  async getFriendRequests(@Req() request: Request & { payload: IPayload }) {
    return this.userService.getFriendRequests(request.payload.sub);
  }

  @UseGuards(AuthGuard)
  @Post('accounts/:accountId/friend-requests')
  async sentFriendRequest(
    @Req() request: Request & { payload: IPayload },
    @Body() { friendName }: { friendName: string },
  ) {
    return this.userService.sendRequest(request.payload.sub, friendName);
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
  @Get('/accounts/:accountId/friends/:friendId')
  async getFriend(
    @Param('friendId') friendId: string,
    @Req() request: Request & { payload: IPayload },
  ) {
    return this.userService.getFriend(request.payload.sub, friendId);
  }

  @UseGuards(AuthGuard)
  @Delete('/accounts/:accountId/friends/:friendId')
  async removeFriend(
    @Req() request: Request & { payload: IPayload },
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(request.payload.sub, friendId);
  }
}
