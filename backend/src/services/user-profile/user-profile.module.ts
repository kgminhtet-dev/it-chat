import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { RepositoryModule } from '../repository/repository.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [RepositoryModule, ChatModule],
  exports: [UserProfileService],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
