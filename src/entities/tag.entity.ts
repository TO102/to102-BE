import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostTag } from './post-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  tag_id: number;

  @Column()
  name: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
