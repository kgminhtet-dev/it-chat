import { IUser } from './user';

export interface IChat {
  id: string;
  name: string;
  lastMessage: string;
  lastChatTime: Date;
  accounts: IUser[];
  createdAt: Date;
  updatedAt: Date;
}
