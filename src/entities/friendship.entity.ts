import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Friendship {
  @ApiProperty({ description: '친구 관계 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'friendship_id' })
  friendshipId: number;

  @ApiProperty({ description: '친구 요청을 보낸 사용자' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id1' })
  user1: User;

  @ApiProperty({ description: '친구 요청을 받은 사용자' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id2' })
  user2: User;

  @ApiProperty({
    description: '친구 관계 상태',
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
  })
  @Column({
    type: 'enum',
    enum: [
      'pending', // 친구요청 보내고 상대의 응답을 기다리는 상태, 이 상태에서 다시 친구요청은 불가
      'accepted', // 친구 요청이 수락되어 두 유저가 친구가 된 상태
      'rejected', // 친구 요청이 거절된 상태
      'cancelled', // 친구 요청을 보낸 유저가 요청을 철회한 상태
    ],
  })
  status: string;

  @ApiProperty({ description: '친구 관계가 생성된 시간' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
