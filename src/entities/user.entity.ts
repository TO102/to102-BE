import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from './location.entity';

@Entity('user')
export class User {
  @ApiProperty({ description: '사용자 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: '사용자 위치 정보', type: () => Location })
  @OneToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ApiProperty({ description: '사용자 이름', required: false })
  @Column({ nullable: true })
  username: string;

  @ApiProperty({ description: '사용자 닉네임' })
  @Column()
  nickname: string;

  @ApiProperty({ description: '사용자 이메일' })
  @Column()
  email: string;

  @ApiProperty({ description: 'OAuth 제공자' })
  @Column({ name: 'oauth_provider' })
  oauthProvider: string;

  @ApiProperty({ description: 'OAuth ID' })
  @Column({ name: 'oauth_id', unique: true })
  oauthId: string;

  @ApiProperty({ description: '프로필 사진 URL' })
  @Column({ name: 'profile_picture_url' })
  profilePictureUrl: string;

  @ApiProperty({ description: '계정 생성 시간' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '계정 정보 마지막 업데이트 시간' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '마지막 로그인 시간' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login',
  })
  lastLogin: Date;

  @ApiProperty({ description: '계정 활성화 상태' })
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ description: '계정 비활성화 시간', required: false })
  @Column({ nullable: true, name: 'deactivated_at' })
  deactivatedAt: Date;

  @ApiProperty({ description: '평균 평점' })
  @Column('decimal', {
    precision: 3,
    scale: 2,
    default: 0,
    name: 'average_rating',
  })
  averageRating: number;

  @ApiProperty({ description: '현재 리프레시 토큰', required: false })
  @Column({ nullable: true, name: 'current_refresh_token' })
  currentRefreshToken: string;
}
