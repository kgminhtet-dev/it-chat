import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account, FriendRequest } from '../entities/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendRequestRepoService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  findById(id: string) {
    return this.friendRequestRepository.findOne({
      where: { id },
      relations: {
        sender: {
          friends: true,
        },
        receiver: {
          friends: true,
        },
      },
    });
  }

  findAllSentRequest(id: string) {
    return this.friendRequestRepository.find({
      where: {
        status: 'pending',
        sender: { id },
      },
      relations: {
        receiver: true,
      },
      order: {
        receiver: {
          fullname: 'ASC',
        },
      },
    });
  }

  findAllReceivedRequest(id: string) {
    return this.friendRequestRepository.find({
      where: {
        status: 'pending',
        receiver: { id },
      },
      relations: {
        sender: true,
      },
      order: {
        sender: {
          fullname: 'ASC',
        },
      },
    });
  }

  remove(id: string) {
    return this.friendRequestRepository.delete(id);
  }

  async createFriendRequest(sender: Account, receiver: Account) {
    const request = this.friendRequestRepository.create({
      sender,
      receiver,
    });
    return this.friendRequestRepository.save(request);
  }
}
