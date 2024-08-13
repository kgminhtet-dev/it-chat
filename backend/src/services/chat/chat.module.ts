import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RepositoryModule } from '../repository/repository.module';
import { ChatWsGateway } from './chat-ws.gateway';
import { ChatWsGatewayService } from './chat-ws.gateway.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RepositoryModule, AuthModule],
  exports: [ChatService],
  controllers: [ChatController],
  providers: [Map, ChatService, ChatWsGateway, ChatWsGatewayService],
})
export class ChatModule {}
