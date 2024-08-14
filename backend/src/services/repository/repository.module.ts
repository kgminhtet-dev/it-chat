import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Chat, Message, Notification } from './entities/entities';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { AccountRepoService } from './Account/account-repo.service';
import { MessageRepoService } from './Message/message-repo.service';
import { ChatRepoService } from './Chat/chat-repo.service';
import { NotificationRepoService } from './Notification/notification-repo.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'itchat',
      entities: [Account, Chat, Message, Notification],
      synchronize: true,
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
