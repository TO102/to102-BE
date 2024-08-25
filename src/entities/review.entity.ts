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
export class Review {
  @ApiProperty({ description: '리뷰 고유 식별자' })
  @PrimaryGeneratedColumn()
  review_id: number;

  @ApiProperty({ description: '리뷰 작성자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ApiProperty({ description: '리뷰 대상자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_id' })
  reviewed: User;

  @ApiProperty({ description: '리뷰 점수', example: 4.5 })
  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', example: '친절하고 응답이 빨라요.' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '리뷰 작성 시간' })
  @CreateDateColumn()
  created_at: Date;
}
