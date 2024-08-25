import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../../entities/post.entity';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'status',
  'thumbnail',
  'province',
  'city',
  'postTags',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // 글 작성자의 ID
}
export class ResponsePostDto extends PickType(Post, [
  'postId',
  'title',
  'content',
  'status',
  'thumbnail',
  'province',
  'city',
  'createdAt',
  'updatedAt',
  'postTags',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // 글 작성자의 ID
}
