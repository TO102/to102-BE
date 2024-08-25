import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Post } from '../../entities/post.entity';
import { Transform } from 'class-transformer';

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

  @IsDateString()
  @Transform(({ value }) => new Date(value))
  meetingDate: Date;
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
  'meetingDate',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // 글 작성자의 ID
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  postTags?: string[];

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  meetingDate?: Date;
}
