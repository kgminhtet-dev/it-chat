import { Socket } from 'socket.io-client';
import { ITime } from '@/lib/types/ITime';

interface SendMessageDto {
  chatId: string;
  content: string;
  life: ITime;
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

export function emitSeen(socket: Socket, data: SendMessageDto) {
  socket.emit('seen chat', data);
}