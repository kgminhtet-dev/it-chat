import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from '../repository.module';
import { Message } from '../entities/entities';
import { MessageRepoService } from './message-repo.service';
import { ChatRepoService } from '../Chat/chat-repo.service';

describe('MessageRepoService', () => {
  let service: MessageRepoService;
  let chatRepoService: ChatRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, TypeOrmModule.forFeature([Message])],
      providers: [MessageRepoService],
    }).compile();

    service = module.get<MessageRepoService>(MessageRepoService);
    chatRepoService = module.get<ChatRepoService>(ChatRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(chatRepoService).toBeDefined();
  });

  it('should print messages by chat id', async () => {
    const chat = await chatRepoService.findIdsByUsername('thuyakyaw');
    const messages = await service.findByChatId(chat[0]);
    console.log('chat id ', chat[0]);
    console.log('messages ', messages, messages.length);
  });

  it('should print chats', async () => {
    const chat = await chatRepoService.findIdsByUsername('thuyakyaw');
    const messages = await service.findAllBetweenDates(
      chat[0],
      new Date('2024-08-07T17:30:00.000Z'),
      new Date('2024-08-07T17:30:00.000Z'),
    );
    console.log('chat id ', chat[0]);
    messages.forEach((message) => {
      console.log(new Date(message.createdAt).toLocaleString());
    });
  });
});
