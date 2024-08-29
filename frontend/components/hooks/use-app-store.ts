import { create } from 'zustand';
import createChatSilce, { ChatsSlice } from '@/components/stores/chat-slice';
import createMessageSlice, { MessagesSlice } from '@/components/stores/messages-slice';
import createTokenSlice, { TokenSlice } from '@/components/stores/token-slice';
import createWebSocketSlice, { WebSocketSlice } from '@/components/stores/websocket-slice';
import createNotiSlice, { NotisSlice } from '@/components/stores/notis-slice';
import createAccountSlice, { AccountSlice } from '@/components/stores/account-slice';

// @ts-ignore
const useAppStore = create<
  AccountSlice & ChatsSlice & MessagesSlice & WebSocketSlice & TokenSlice & NotisSlice
>((...a) => ({
  ...createAccountSlice(...a),
  ...createChatSilce(...a),
  ...createMessageSlice(...a),
  ...createWebSocketSlice(...a),
  ...createTokenSlice(...a),
  ...createNotiSlice(...a),
}));

export default useAppStore;
