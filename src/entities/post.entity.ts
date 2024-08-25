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
import { Location } from './location.entity';

@Entity('post')
export class Post {
  @ApiProperty({ description: '게시글 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: '게시글 작성자', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '게시글 관련 위치', type: () => Location })
  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

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
}
