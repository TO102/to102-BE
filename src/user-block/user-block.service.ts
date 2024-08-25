// block.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBlock } from 'src/entities/user-block.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(UserBlock)
    private userBlockRepository: Repository<UserBlock>,
  ) {}

  async blockUser(blockerId: number, blockedId: number): Promise<UserBlock> {
    if (blockerId === blockedId) {
      throw new BadRequestException('자기 자신을 차단할 수 없습니다.');
    }

    // 이미 차단된 상태인지 확인
    const existingBlock = await this.userBlockRepository.findOne({
      where: { blocker: { userId: blockerId }, blocked: { userId: blockedId } },
    });

    if (existingBlock) {
      throw new BadRequestException('이미 차단된 사용자입니다.');
    }

    const block = this.userBlockRepository.create({
      blocker: { userId: blockerId } as any,
      blocked: { userId: blockedId } as any,
    });

    return this.userBlockRepository.save(block);
  }

  async unblockUser(blockerId: number, blockedId: number): Promise<void> {
    const block = await this.userBlockRepository.findOne({
      where: { blocker: { userId: blockerId }, blocked: { userId: blockedId } },
    });

    if (!block) {
      throw new NotFoundException('차단된 사용자를 찾을 수 없습니다.');
    }

    await this.userBlockRepository.delete(block.blockId);
  }

  async isBlocked(blockerId: number, blockedId: number): Promise<boolean> {
    const block = await this.userBlockRepository.findOne({
      where: { blocker: { userId: blockerId }, blocked: { userId: blockedId } },
    });
    return !!block;
  }
}
