export interface INotification {
  id: number;
  content: string;
  type: string;
  isRead: boolean;
  recipient: string;
  createdAt: Date;
  updatedAt: Date;
}
