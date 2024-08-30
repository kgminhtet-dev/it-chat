import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { ChatIdEventDto } from './dto/chat-id-event.dto';
import { MessageEventDto } from './dto/message-event.dto';
import { NewChatEventDto } from './dto/new-chat-event.dto';
import { AuthWsGuard } from './services/auth/auth-ws.guard';
import { ChatService } from './services/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppWsGateway {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppWsGateway');

  constructor(
    private readonly connList: Map<string, Socket>,
    private readonly appService: AppService,
    private readonly chatService: ChatService,
    private readonly authWsGuard: AuthWsGuard,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    const payload = await this.authWsGuard.validateToken(client);
    const accountId = payload.sub;
    if (!accountId) {
      this.server.emit('error', { message: 'Invalid token' });
      return client.disconnect();
    }
    this.connList.set(accountId, client);
    try {
      const chatIds = await this.chatService.getChatIdListOf(accountId);
      chatIds.forEach((room) => client.join(room.id));
      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.error(error);
      this.server.emit('error', { message: 'Internal Server Error' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const accountId = client.handshake.query.id as string;
    const chatIds = await this.chatService.getChatIdListOf(accountId);
    chatIds.forEach((room) => client.leave(room.id));
    this.connList.delete(accountId);
    this.logger.log(`Client disconnected: ${client.id} and ${accountId}`);
  }

  @SubscribeMessage('chat id')
  async handleGettingChatId(
    @MessageBody() { senderId, receiverId }: ChatIdEventDto,
  ) {
    const chatId = this.appService.generateUUID4();
    const accounts = await this.chatService.getMembers([senderId, receiverId]);
    const senderConn = this.connList.get(senderId);
    if (!senderConn) {
      this.server.emit('error', { message: 'Invalid socket.' });
      return;
    }
    senderConn.join(chatId);
    this.server.to(chatId).emit('chat id', {
      id: chatId,
      contact: accounts.filter((account) => account.id !== senderId)[0],
      participants: accounts,
    });
  }

  @SubscribeMessage('new chat')
  async handleStaringNewChat(
    @MessageBody()
    { sender, participants, chatId, content }: NewChatEventDto,
  ) {
    const chat = await this.chatService.createChat(chatId, participants);
    const message = this.chatService.createMessage(sender, chatId, content);
    const members = chat.members.map((account) => ({
      id: account.id,
      fullname: account.fullname,
      username: '@' + account.username,
      isDeactivated: account.isDeactivated,
    }));

    members.forEach((member) => {
      const socket = this.connList.get(member.id);
      if (socket) socket.join(chatId);
    });
    await this.chatService.saveMessage(message);
    this.server.to(chatId).emit('new chat', {
      message,
      chat: {
        id: chat.id,
        lastMessage: message.content,
        lastChatTime: message.createdAt,
        name: chat.name,
        participants: members,
      },
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    { sender, chatId, content }: MessageEventDto,
  ) {
    const message = this.chatService.createMessage(sender, chatId, content);
    await this.chatService.saveMessage(message);
    this.server.to(chatId).emit('message', message);
  }
}
