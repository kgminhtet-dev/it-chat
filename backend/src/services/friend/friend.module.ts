import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  exports: [FriendService],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
