import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  friendship_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id1' })
  user1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id2' })
  user2: User;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
