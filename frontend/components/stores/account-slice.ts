import { StateCreator } from 'zustand';
import { IAccount } from '@/lib/types/IAccount';

export interface AccountSlice {
  account: IAccount | undefined;

  setAccount: (account: IAccount | undefined) => void;
}

const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  account: undefined,

  setAccount: (account: IAccount | undefined) => set({ account }),
});

export default createAccountSlice;
