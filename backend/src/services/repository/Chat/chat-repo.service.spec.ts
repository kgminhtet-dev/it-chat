import { ChatRepoService } from './chat-repo.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryModule } from '../repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Chat } from '../entities/entities';

describe('ChatRepoService', () => {
  let service: ChatRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, TypeOrmModule.forFeature([Chat, Account])],
      providers: [ChatRepoService],
    }).compile();

    service = module.get<ChatRepoService>(ChatRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
