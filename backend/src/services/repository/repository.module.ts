import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  Chat,
  FriendRequest,
  Message,
  Notification,
} from './entities/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { AccountRepoService } from './Account/account-repo.service';
import { MessageRepoService } from './Message/message-repo.service';
import { ChatRepoService } from './Chat/chat-repo.service';
import { NotificationRepoService } from './Notification/notification-repo.service';
import { FriendRequestRepoService } from './FriendRequest/friendRequest-repo.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT', 5432), // Default to 5432 if not specified
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [Account, FriendRequest, Chat, Message, Notification],
        synchronize: true,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    TypeOrmModule.forFeature([
      Account,
      FriendRequest,
      Chat,
      Message,
      Notification,
    ]),
  ],
  exports: [
    AccountRepoService,
    MessageRepoService,
    ChatRepoService,
    NotificationRepoService,
    FriendRequestRepoService,
  ],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    AccountRepoService,
    MessageRepoService,
    ChatRepoService,
    NotificationRepoService,
    FriendRequestRepoService,
  ],
})
export class RepositoryModule {}
