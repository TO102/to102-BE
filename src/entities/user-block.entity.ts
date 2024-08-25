import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('user_block')
export class UserBlock {
  @ApiProperty({ description: '차단 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'block_id' })
  blockId: number;

  @ApiProperty({ description: '차단한 사용자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocker_id' })
  blocker: User;

  @ApiProperty({ description: '차단된 사용자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocked_id' })
  blocked: User;

  @ApiProperty({ description: '차단 생성 시간' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
