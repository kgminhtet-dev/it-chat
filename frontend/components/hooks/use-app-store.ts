import { create } from 'zustand';
import createAccountSlice, { AccountSlice } from '@/components/stores/account-slice';
import createChatSilce, { ChatsSlice } from '@/components/stores/chat-slice';
import createMessageSlice, { MessagesSlice } from '@/components/stores/messages-slice';
import createTokenSlice, { TokenSlice } from '@/components/stores/token-slice';
import createWebSocketSlice, { WebSocketSlice } from '@/components/stores/websocket-slice';
import createCurrentChatSlice, { CurrentChatSlice } from '../stores/current-chat-slice';

const useAppStore = create<
  AccountSlice &
  ChatsSlice &
  MessagesSlice &
  WebSocketSlice &
  TokenSlice &
  CurrentChatSlice
>((...a) => ({
  ...createAccountSlice(...a),
  ...createChatSilce(...a),
  ...createMessageSlice(...a),
  ...createWebSocketSlice(...a),
  ...createTokenSlice(...a),
  ...createCurrentChatSlice(...a),
}));

export default useAppStore;
