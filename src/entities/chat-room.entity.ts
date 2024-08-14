import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  chat_room_id: number;

  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  closed_at: Date;

  @Column()
  last_message_at: Date;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
