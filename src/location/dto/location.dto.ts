import { ApiProperty, PickType, OmitType } from '@nestjs/swagger';

export class Location {
  @ApiProperty({ example: 1, description: '위치 고유 식별자' })
  id: number;

  @ApiProperty({ example: '서울', description: '도시 이름' })
  city: string;

  @ApiProperty({ example: '강남구', description: '구 이름' })
  district: string;

  @ApiProperty({ example: '역삼동', description: '동 이름' })
  neighborhood: string;

  @ApiProperty({ example: 10, description: '해당 지역의 게시글 수' })
  postCount: number;
}

export class LocationResponseDto extends OmitType(Location, [
  'postCount',
] as const) {}

export class LocationWithPostCountDto extends Location {}

export class PostCountResponseDto extends PickType(Location, [
  'postCount',
] as const) {}
