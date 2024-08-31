import { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';
import { ChatsSlice } from './chat-slice';
import { MessagesSlice } from './messages-slice';
import { CurrentChatSlice } from './current-chat-slice';
import { IMessage } from '@/lib/types/IMessage';
import { IChat } from '@/lib/types/IChat';
import { AccountSlice } from '@/components/stores/account-slice';
import { IAccount } from '@/lib/types/IAccount';

export interface WebSocketSlice {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  handleMessageEvent: (message: IMessage) => void;
  handleNewChatEvent: ({
                         message,
                         chat,
                       }: {
    message: IMessage;
    chat: IChat;
  }) => void;
  handleChatIdEvent: (chat: IChat) => void;
}

const createWebSocketSlice: StateCreator<
  AccountSlice & ChatsSlice & MessagesSlice & CurrentChatSlice & WebSocketSlice,
  [],
  [],
  WebSocketSlice
> = (set, get) => ({
  socket: null,

  setSocket: (socket: Socket | null) => {
    socket?.on('message', (message: IMessage) =>
      get().handleMessageEvent(message),
    );
    socket?.on('chat id', (chat: IChat) => {
      get().handleChatIdEvent(chat);
    });
    socket?.on('new chat', (payload) => get().handleNewChatEvent(payload));

    return set({ socket });
  },

  handleMessageEvent: (message: IMessage) => {
    get().setChats(
      get().chats.map((chat) =>
        chat.id === message.chatId
          ? {
            ...chat,
            lastMessage: message.content,
            lastChatTime: message.createdAt,
          }
          : chat,
      ).sort((c1, c2) => new Date(c2.lastChatTime).getTime() - new Date(c1.lastChatTime).getTime()),
    );
    if (get().currentChat?.id && get().currentChat?.id === message.chatId)
      get().addMessage(message);
  },

  handleChatIdEvent: (chat: IChat) => {
    get().addChat(chat);
    get().setCurrentChat(chat);
    get().setMessages([]);
  },

  handleNewChatEvent: ({ message, chat }) => {
    const account = get().account as IAccount;
    chat.contact = chat.participants.filter((participant) => participant.id !== account.id)[0];
    console.log('chat ', chat, 'current chat ', get().currentChat);
    if (chat.id === get().currentChat?.id) {
      get().addMessage(message);
      get().setChats(get().chats.map((c) => {
        if (chat.id === c.id) return chat;
        return c;
      }));
    } else {
      get().addChat(chat);
    }
  },
});

export default createWebSocketSlice;
