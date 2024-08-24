import { IAccount } from '@/lib/types/IAccount';

export interface IFriendRequest {
  id: string;
  status: string;
  receiver: IAccount;
  sender: IAccount;
}