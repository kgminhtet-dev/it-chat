import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './services/repository/repository.module';
import { AuthModule } from './services/auth/auth.module';
import { UserProfileModule } from './services/user-profile/user-profile.module';
import { FriendModule } from './services/friend/friend.module';
import { NotificationModule } from './services/notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './services/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RepositoryModule,
    AuthModule,
    UserProfileModule,
    ChatModule,
    FriendModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
