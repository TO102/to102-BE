import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';
import { PostTag } from './post-tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  view_count: number;

  @Column()
  status: string;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];
}
