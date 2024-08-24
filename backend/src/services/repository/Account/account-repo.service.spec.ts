import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepoService } from './account-repo.service';
import { RepositoryModule } from '../repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from '../entities/entities';

describe('AccountRepoService', () => {
  let service: AccountRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, TypeOrmModule.forFeature([Account])],
      providers: [AccountRepoService],
    }).compile();

    service = module.get<AccountRepoService>(AccountRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log all accounts', async () => {
    console.log(await service.findAll());
  });

  it('should log all accounts by username', async () => {
    console.log(await service.findAll(['kgkg', 'kgminhtet']));
  });

  it('should create a new account', async () => {
    const account: CreateAccountDto = {
      fullname: 'Phyo Myat Aung',
      username: 'phyoumyatag',
      email: 'phyoumyatag@example.com',
      password: '12345678',
    };
    const newAccount = await service.create(account);
    expect(newAccount.username).toBe(account.username);
  });

  it('find by username', async () => {
    const username = 'pmag';
    const account = await service.findByUsername(username);
    expect(account.username).toBe(username);
  });

  it('find by email', async () => {
    const email = 'phyoumyatag@example.com';
    const account = await service.findByEmail(email);
    expect(account.email).toBe(email);
  });

  it('should update username', async () => {
    const username = 'pmagg';
    const newUsername = 'pmag';
    await service.update(username, { username: newUsername });
    const account = await service.findByUsername(newUsername);
    expect(account.username).toBe(newUsername);
  });
});
