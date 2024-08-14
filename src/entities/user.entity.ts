import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLocation } from './user-location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
  userLocations: UserLocation[];

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  oauth_provider: string;

  @Column()
  oauth_id: string;

  @Column()
  profile_picture_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  last_login: Date;

  @Column()
  is_active: boolean;

  @Column({ nullable: true })
  deactivated_at: Date;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  average_rating: number;
}
