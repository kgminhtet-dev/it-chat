import { IAccount } from "@/lib/types/IAccount";

export interface IChat {
  id: string;
  name?: string;
  contact: IAccount;
  participants: IAccount[];
  lastMessage: string;
  lastChatTime: Date;
}
