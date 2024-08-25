import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Friendship } from '../entities/friendship.entity';
import { FriendBriefDto } from './dto/friendship.dto';
import { UserBlock } from '../entities/user-block.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserBlock)
    private userBlockRepository: Repository<UserBlock>,
  ) {}

  async sendFriendRequest(
    user1Id: number,
    user2Id: number,
  ): Promise<Friendship> {
    // 사용자 존재 확인
    const user1 = await this.userRepository.findOne({
      where: { userId: user1Id },
    });
    const user2 = await this.userRepository.findOne({
      where: { userId: user2Id },
    });

    if (!user1 || !user2) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 차단된 상태인지 확인
    const blockCheck = await this.userBlockRepository.findOne({
      where: [
        { blocker: { userId: user1Id }, blocked: { userId: user2Id } },
        { blocker: { userId: user2Id }, blocked: { userId: user1Id } },
      ],
    });

    if (blockCheck) {
      throw new BadRequestException(
        '차단된 사용자와 친구 요청을 할 수 없습니다.',
      );
    }

    // 기존 친구 요청 또는 친구 관계가 있는지 확인
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'pending') {
        throw new BadRequestException('이미 친구 요청이 진행 중입니다.');
      } else if (existingFriendship.status === 'accepted') {
        throw new BadRequestException('이미 친구 관계입니다.');
      } else if (
        existingFriendship.status === 'rejected' ||
        existingFriendship.status === 'cancelled'
      ) {
        existingFriendship.status = 'pending';
      }
      return this.friendshipRepository.save(existingFriendship);
    } else {
      const friendship = this.friendshipRepository.create({
        user1,
        user2,
        status: 'pending',
      });
      return this.friendshipRepository.save(friendship);
    }
  }

  async updateFriendshipStatus(
    user1Id: number,
    user2Id: number,
    newStatus: 'accepted' | 'rejected' | 'cancelled',
  ): Promise<Friendship> {
    // 사용자 존재 확인
    const user1 = await this.userRepository.findOne({
      where: { userId: user1Id },
    });
    const user2 = await this.userRepository.findOne({
      where: { userId: user2Id },
    });

    if (!user1 || !user2) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 차단된 상태인지 확인
    const blockCheck = await this.userBlockRepository.findOne({
      where: [
        { blocker: { userId: user1Id }, blocked: { userId: user2Id } },
        { blocker: { userId: user2Id }, blocked: { userId: user1Id } },
      ],
    });

    if (blockCheck) {
      throw new BadRequestException(
        '차단된 사용자와 친구 상태를 업데이트할 수 없습니다.',
      );
    }

    // 기존 친구 요청 또는 친구 관계가 있는지 확인
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { user1: { userId: user1Id }, user2: { userId: user2Id } },
        { user1: { userId: user2Id }, user2: { userId: user1Id } },
      ],
      relations: ['user1', 'user2'],
    });

    if (!friendship) {
      throw new NotFoundException('해당 친구 관계를 찾을 수 없습니다.');
    }

    // 동일한 상태로의 변경을 막음
    if (friendship.status === newStatus) {
      throw new BadRequestException(
        `현재 상태(${friendship.status})와 동일한 상태로 변경할 수 없습니다.`,
      );
    }

    // 상태 업데이트
    if (friendship.status === 'accepted' && newStatus === 'cancelled') {
      throw new BadRequestException(
        '이미 수락된 친구 관계는 취소할 수 없습니다.',
      );
    }

    if (friendship.status === 'rejected' && newStatus === 'cancelled') {
      throw new BadRequestException(
        '이미 거절된 친구 관계는 취소할 수 없습니다.',
      );
    }

    friendship.status = newStatus;
    return this.friendshipRepository.save(friendship);
  }

  async getMutualFriendById(userId: number): Promise<FriendBriefDto[]> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 친구 관계에서 userId가 user1 또는 user2에 있는지 확인
    const friendships = await this.friendshipRepository.find({
      where: [
        { user1: { userId }, status: 'accepted' },
        { user2: { userId }, status: 'accepted' },
      ],
      relations: ['user1', 'user2'],
    });

    if (!friendships || friendships.length === 0) {
      return [];
    }

    // 친구 관계에서 userId와 일치하지 않는 상대방의 정보를 반환
    return friendships.map((friendship) => {
      const friend =
        friendship.user1.userId !== userId
          ? friendship.user2
          : friendship.user1;
      return {
        userId: friend.userId,
        username: friend.username,
        profilePictureUrl: friend.profilePictureUrl,
      } as FriendBriefDto;
    });
  }
  async deleteFriendship(id: number) {
    const friendship = await this.friendshipRepository.findOne({
      where: { friendshipId: id },
    });

    if (!friendship) {
      throw new NotFoundException('해당 친구 관계를 찾을 수 없습니다.');
    }

    if (friendship.status !== 'accepted') {
      throw new BadRequestException(
        '친구 관계 상태가 accepted일 경우에만 삭제 가능합니다.',
      );
    }

    await this.friendshipRepository.delete(id);
  }
}
