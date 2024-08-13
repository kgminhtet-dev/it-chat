import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class AuthWsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  validateToken(client: Socket) {
    const authToken = client.handshake.headers.authorization;

    if (!authToken) {
      return false;
    }

    try {
      const token = this.extractTokenFromSocket(client);
      return this.jwtService.verifyAsync(token);
    } catch {
      return false;
    }
  }

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake.headers.authorization;

    if (!authToken) {
      throw new WsException('Unauthorized');
    }

    try {
      const token = this.extractTokenFromSocket(client);
      client.payload = await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }

  private extractTokenFromSocket(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
