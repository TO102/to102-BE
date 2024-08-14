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
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_id' })
  reviewed: User;

  @Column()
  rating: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
