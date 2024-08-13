import { IChat } from './chat';
import { IUser } from './user';

export interface IAccount {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  isDeactivated: boolean;
  chats: IChat[];
  friends: IUser[];
  createdAt: Date;
  updatedAt: Date;
}
