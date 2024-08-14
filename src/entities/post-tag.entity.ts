import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity()
export class PostTag {
  @PrimaryGeneratedColumn()
  post_tag_id: number;

  @ManyToOne(() => Post, (post) => post.postTags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
