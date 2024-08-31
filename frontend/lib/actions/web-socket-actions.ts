import { Socket } from 'socket.io-client';

interface SendMessageDto {
  chatId: string;
  sender: string;
  content: string;
}

export function emitMessage(socket: Socket, data: SendMessageDto) {
  socket.emit('message', data);
}

export function emitChatId(socket: Socket, data: any) {
  socket.emit('chat id', data);
}

export function emitNewChat(socket: Socket, data: any) {
  socket.emit('new chat', data);
}
