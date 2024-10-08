import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as path from 'node:path';
import { AppWsGateway } from './app-ws.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/auth/auth.module';
import { ChatModule } from './services/chat/chat.module';
import { NotificationModule } from './services/notification/notification.module';
import { RepositoryModule } from './services/repository/repository.module';
import { UserProfileModule } from './services/user-profile/user-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(
        `.env.${process.env.NODE_ENV || 'development'}`,
      ),
      isGlobal: true,
    }),
    JwtModule,
    RepositoryModule,
    AuthModule,
    UserProfileModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppWsGateway, Map],
})
export class AppModule {}
