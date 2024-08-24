import { IAccount } from '@/lib/types/IAccount';
import { StateCreator } from 'zustand';

export interface FriendsSlice {
  friends: IAccount[] | null;

  setFriends(friends: IAccount[]): void;

  addFriend(friend: IAccount): void;

  removeFriend(friend: IAccount): void;
}

const createFriendsSlice: StateCreator<FriendsSlice> = ((set) => ({
  friends: null,

  setFriends: (friends: IAccount[]) => set({ friends }),
  addFriend: (friend) => set((state) =>
    ({ friends: state.friends ? [...state.friends, friend] : [friend] })),
  removeFriend: (removedfriend: IAccount) => set((state) =>
    ({ friends: state.friends && state.friends.filter(friend => removedfriend.id !== friend.id) })),
}));

export default createFriendsSlice;