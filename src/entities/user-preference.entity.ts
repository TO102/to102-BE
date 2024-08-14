import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPreference {
  @PrimaryGeneratedColumn()
  user_preference_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  notifications_enabled: boolean;
}
