import { create } from 'zustand';
import createWebSocketSlice, { WebSocketSlice } from '@/components/stores/websocket-slice';
import createChatSilce, { ChatsSlice } from '@/components/stores/chat-slice';
import createProfileSlice, { ProfileSlice } from '@/components/stores/profile-slice';
import createMessageSlice, { MessagesSlice } from '@/components/stores/messages-slice';
import createTokenSlice, { TokenSlice } from '@/components/stores/token-slice';
import createFriendsSlice, { FriendsSlice } from '@/components/stores/friends-slice';

const useAppStore = create<
  ProfileSlice & ChatsSlice & MessagesSlice &
  WebSocketSlice & TokenSlice & FriendsSlice
>((...a) => ({
  ...createProfileSlice(...a),
  ...createChatSilce(...a),
  ...createMessageSlice(...a),
  ...createWebSocketSlice(...a),
  ...createTokenSlice(...a),
  ...createFriendsSlice(...a),
}));

export default useAppStore;
