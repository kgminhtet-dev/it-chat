import { ITime } from '../types/time';

export interface MessageEventDto {
  content: string;
  chatId: string;
  life: ITime;
}
