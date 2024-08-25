import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
@Entity('post')
export class Post {
  @ApiProperty({ description: '게시글 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: '게시글 작성자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '도/시' })
  @Column()
  province: string;

  @ApiProperty({ description: '시/군/구' })
  @Column()
  city: string;

  @ApiProperty({ description: '게시글 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '썸네일 이미지 URL' })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({ description: '게시글 작성 시간' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '게시글 수정 시간' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '게시글 상태 (예: 공개, 비공개, 삭제됨 등)' })
  @Column()
  status: string;

  @Column({ type: 'jsonb', default: '[]' })
  @ApiProperty({ description: '게시글에 연결된 태그들' })
  postTags: string[];

  @ApiProperty({ description: '만나는 날짜' })
  @Column({
    name: 'meeting_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP', // 기본값을 현재 시간으로 설정
    nullable: false, // NOT NULL 제약 조건
  })
  meetingDate: Date;
}
