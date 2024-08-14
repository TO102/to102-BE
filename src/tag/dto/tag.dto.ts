import { ApiProperty, PickType } from '@nestjs/swagger';

export class Tag {
  @ApiProperty({ example: 1, description: '태그 고유 식별자' })
  id: number;

  @ApiProperty({ example: '가이드 친구', description: '태그 이름' })
  name: string;

  @ApiProperty({
    example: '가이드 역할을 할 수 있는 친구',
    description: '태그 설명',
  })
  description: string;

  @ApiProperty({ example: 100, description: '태그가 사용된 게시글 수' })
  postCount: number;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '태그 생성 시간',
  })
  createdAt: Date;
}

export class TagResponseDto extends PickType(Tag, [
  'id',
  'name',
  'description',
] as const) {}

export class CreateTagDto extends PickType(Tag, [
  'name',
  'description',
] as const) {}
