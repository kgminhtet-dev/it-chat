import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/entities';

@Injectable()
export class NotificationRepoService {
  constructor(
    @InjectRepository(Notification)
    private notiRepository: Repository<Notification>,
  ) {}
}
