import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;

    if (!authToken) {
      throw new UnauthorizedException('Token is required.');
    }

    try {
      const token = this.extractTokenFromHeader(authToken);
      request['payload'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  private extractTokenFromHeader(authToken: string): string | undefined {
    const [type, token] = authToken.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
