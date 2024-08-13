import { StateCreator } from 'zustand';

export interface TokenSlice {
  token: string | undefined;

  setToken: (token: string | undefined) => void;
}

const createTokenSlice: StateCreator<TokenSlice> = (set) => ({
  token: undefined,

  setToken: (token: string | undefined) => set({ token }),
});

export default createTokenSlice;