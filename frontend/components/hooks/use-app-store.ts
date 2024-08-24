import createChatSilce, { ChatsSlice } from "@/components/stores/chat-slice";
import createMessageSlice, {
  MessagesSlice,
} from "@/components/stores/messages-slice";
import createProfileSlice, {
  ProfileSlice,
} from "@/components/stores/profile-slice";
import createTokenSlice, { TokenSlice } from "@/components/stores/token-slice";
import createWebSocketSlice, {
  WebSocketSlice,
} from "@/components/stores/websocket-slice";
import { create } from "zustand";

const useAppStore = create<
  ProfileSlice & ChatsSlice & MessagesSlice & WebSocketSlice & TokenSlice
>((...a) => ({
  ...createProfileSlice(...a),
  ...createChatSilce(...a),
  ...createMessageSlice(...a),
  ...createWebSocketSlice(...a),
  ...createTokenSlice(...a),
}));

export default useAppStore;
