import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from '../repository/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthWsGuard } from './auth-ws.guard';

@Module({
  imports: [
    RepositoryModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [AuthService, AuthWsGuard],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AuthWsGuard],
})
export class AuthModule {}
