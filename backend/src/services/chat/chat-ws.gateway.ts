import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatIdEventDto } from './dto/chat-id-event.dto';
import { MessageEventDto } from './dto/message-event.dto';
import { NewChatEventDto } from './dto/new-chat-event.dto';
import { ChatWsGatewayService } from './chat-ws.gateway.service';
import { AuthWsGuard } from '../auth/auth-ws.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatWsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connList: Map<string, Socket>,
    private readonly gatewayService: ChatWsGatewayService,
    private readonly authWsGuard: AuthWsGuard,
  ) {}

  async handleConnection(client: Socket) {
    const payload = await this.authWsGuard.validateToken(client);
    const username = payload.username;
    if (!username) {
      this.server.emit('error', 'Invalid token.');
      return client.disconnect();
    }

    this.connList.set(username, client);
    console.info(`Client connected: ${client.id}`);

    this.gatewayService
      .getChatIds(username)
      .then((chatIds: string[]) =>
        chatIds.forEach((room) => {
          client.join(room);
        }),
      )
      .catch((error) => this.server.emit('error', { error: error.toString() }));
  }

  handleDisconnect(client: Socket) {
    const username = client.handshake.query.username as string;
    this.connList.delete(username);
    console.info(`Client disconnected: ${client.id} and ${username}`);

    this.gatewayService
      .getChatIds(username)
      .then((chatIds: string[]) =>
        chatIds.forEach((room) => {
          client.leave(room);
        }),
      )
      .catch((error) => this.server.emit('error', { error: error.toString() }));
  }

  @SubscribeMessage('chat id')
  async handleChatId(
    @MessageBody() { sender, participants }: ChatIdEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chatId = this.gatewayService.getUUID4();
    const socket = this.connList.get(sender);
    const accounts = await this.gatewayService.getAccounts(participants);
    const respAccounts = accounts.map((account) => ({
      id: account.id,
      fullname: account.fullname,
      username: account.username,
    }));

    socket.join(chatId);

    this.server.to(chatId).emit('chat id', {
      id: chatId,
      contact: respAccounts.filter((account) => account.username !== sender)[0],
      participants: respAccounts,
    });
  }

  @SubscribeMessage('new chat')
  async handleNewChat(
    @MessageBody()
    { sender, participants, chatId, content }: NewChatEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.gatewayService.creatChat(chatId, participants);
    participants.forEach((p) => {
      const socket = this.connList.get(p);
      if (socket) socket.join(chatId);
    });
    const message = this.gatewayService.createMessage(sender, chatId, content);
    this.server.to(chatId).emit('new chat', {
      message,
      chat,
    });
    await this.gatewayService.saveMessage(message);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    { sender, chatId, content }: MessageEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.gatewayService.createMessage(sender, chatId, content);
    this.server.to(chatId).emit('message', message);
    await this.gatewayService.saveMessage(message);
  }
}
