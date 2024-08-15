import { Socket } from 'socket.io-client';

interface SendMessageDto {
  chatId: string;
  sender: string;
  content: string;
}

export function deactivate(socket: Socket) {
  socket.emit('deactivate');
}

export function sendMessage(socket: Socket, data: SendMessageDto) {
  socket.emit('message', data);
}

export function getChat(socket: Socket, data: any) {
  socket.emit('chat id', data);
}

export function startChat(socket: Socket, data: any) {
  socket.emit('new chat', data);
}
