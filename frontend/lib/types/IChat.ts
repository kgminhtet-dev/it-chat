import { IMember } from '@/lib/types/IMember';

export interface IChat {
  id: string;
  name?: string;
  isActive: boolean;
  contact: IMember;
  participants: IMember[];
  lastMessage: string;
  lastChatTime: Date;
}
