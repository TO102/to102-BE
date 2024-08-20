import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger';

export class AddressInfo {
  @ApiProperty({ example: '서울특별시', description: '시/도 이름' })
  province: string;

  @ApiProperty({ example: '강남구', description: '시/군/구 이름' })
  city: string;

  @ApiProperty({ example: '역삼동', description: '동/읍/면 이름' })
  district: string;
}

export class LocationBase extends AddressInfo {
  @ApiProperty({ example: 1, description: '위치 고유 식별자' })
  id: number;
}

export class PostCount {
  @ApiProperty({ example: 10, description: '해당 지역의 게시글 수' })
  postCount: number;
}

export class LocationResponseDto extends LocationBase {}

export class LocationWithPostCountDto extends IntersectionType(
  LocationBase,
  PostCount,
) {}

export class PostCountResponseDto extends PickType(LocationWithPostCountDto, [
  'postCount',
] as const) {}

export class AddressInfoDto extends AddressInfo {}
