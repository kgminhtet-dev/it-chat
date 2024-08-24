export interface IAccount {
  id: string;
  fullname: string;
  username: string;
  isDeactivated: boolean;
  relationship?: 'friend' | 'unfriend';
}
