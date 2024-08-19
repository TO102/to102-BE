import { ApiProperty, PickType } from '@nestjs/swagger';

export class Post {
  @ApiProperty({ example: 1, description: '게시글 고유 식별자' })
  id: number;

  @ApiProperty({ example: '제목입니다', description: '게시글 제목' })
  title: string;

  @ApiProperty({ example: '내용입니다', description: '게시글 내용' })
  content: string;

  @ApiProperty({ example: 1, description: '작성자 ID' })
  authorId: number;

  @ApiProperty({ example: 1, description: '위치 ID' })
  locationId: number;

  @ApiProperty({ example: ['여행', '맛집'], description: '게시글 태그' })
  tags: string[];

  @ApiProperty({ example: '2023-08-13T12:00:00Z', description: '작성 시간' })
  createdAt: Date;

  @ApiProperty({ example: '2023-08-13T12:00:00Z', description: '수정 시간' })
  updatedAt: Date;

  @ApiProperty({ example: 100, description: '조회수' })
  viewCount: number;
}

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'locationId',
  'tags',
] as const) {}

export class UpdatePostDto extends PickType(Post, [
  'title',
  'content',
  'tags',
] as const) {}

export class PostResponseDto extends Post {}

export class LatestPostDto extends PickType(Post, ['id', 'title'] as const) {
  id: number;
  author: { id: number; name: string };
  tags: { id: number; name: string }[];
  location: { id: number; city: string; district: string };
}
