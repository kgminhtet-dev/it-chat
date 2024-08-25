import { StateCreator } from 'zustand';

export interface NotisSlice {
  messageNoti: boolean;

  setMessageNoti(noti: boolean): void;
}

const createNotiSlice: StateCreator<NotisSlice> = (set) => ({
  messageNoti: false,

  setMessageNoti: (noti: boolean) => set({ messageNoti: noti }),
});

export default createNotiSlice;