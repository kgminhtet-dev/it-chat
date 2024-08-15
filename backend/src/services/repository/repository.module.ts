import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Chat, Message, Notification } from './entities/entities';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { AccountRepoService } from './Account/account-repo.service';
import { MessageRepoService } from './Message/message-repo.service';
import { ChatRepoService } from './Chat/chat-repo.service';
import { NotificationRepoService } from './Notification/notification-repo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Account, Chat, Message, Notification],
      ssl: true,
    }),
    TypeOrmModule.forFeature([Account, Chat, Message, Notification]),
  ],
  exports: [
    AccountRepoService,
    MessageRepoService,
    ChatRepoService,
    NotificationRepoService,
  ],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    AccountRepoService,
    MessageRepoService,
    ChatRepoService,
    NotificationRepoService,
  ],
})
export class RepositoryModule {}
