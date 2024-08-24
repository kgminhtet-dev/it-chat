import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullname: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'bool', default: false })
  isDeactivated: boolean;

  @ManyToMany(() => Chat, (chat) => chat.accounts)
  chats: Chat[];

  @ManyToMany(() => Account, (account) => account.friends)
  @JoinTable({
    name: 'friend',
    joinColumn: {
      name: 'account_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'id',
    },
  })
  friends: Account[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    cascade: true,
  })
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    cascade: true,
  })
  receivedFriendRequests: FriendRequest[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  updatedAt: Date;
}

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  receiver: Account;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  lastMessage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  lastChatTime: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @ManyToMany(() => Account, (account) => account.chats)
  @JoinTable({
    name: 'account_chat',
  })
  accounts: Account[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  updatedAt: Date;
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Account)
  sender: Account;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_DATE' })
  updatedAt: Date;
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => Account)
  recipient_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
