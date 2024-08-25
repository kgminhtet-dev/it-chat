import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [RepositoryModule],
  exports: [ChatService],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
