import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  welcome(): string {
    return 'Welcome to Real Time Chat Application API!';
  }

  generateUUID4() {
    return uuidv4();
  }
}
