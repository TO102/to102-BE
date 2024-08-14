import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  sent_at: Date;

  @Column()
  message_type: string;

  @Column()
  is_read: boolean;
}
