import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLocation } from './user-location.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
  userLocations: UserLocation[];

  @Column({ nullable: true })
  username: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ name: 'oauth_provider' })
  oauthProvider: string;

  @Column({ name: 'oauth_id', unique: true })
  oauthId: string;

  @Column({ name: 'profile_picture_url' })
  profilePictureUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login',
  })
  lastLogin: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'deactivated_at' })
  deactivatedAt: Date;

  @Column('decimal', {
    precision: 3,
    scale: 2,
    default: 0,
    name: 'average_rating',
  })
  averageRating: number;

  @Column({ nullable: true, name: 'current_refresh_token' })
  currentRefreshToken: string;
}
