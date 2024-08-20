import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger';

// 기본 주소 정보 DTO
export class AddressInfo {
  @ApiProperty({ example: '서울특별시', description: '시/도 이름' })
  province: string;

  @ApiProperty({ example: '강남구', description: '시/군/구 이름' })
  city: string;

  @ApiProperty({ example: '역삼동', description: '동/읍/면 이름' })
  district: string;
}

// 위치 응답 DTO
export class LocationResponseDto extends AddressInfo {
  @ApiProperty({ example: 1, description: '위치 고유 식별자' })
  id: number;
}

// 게시글 수 DTO
export class PostCount {
  @ApiProperty({ example: 10, description: '해당 지역의 게시글 수' })
  postCount: number;
}

// 게시글 수를 포함한 위치 정보 DTO
export class LocationWithPostCountDto extends IntersectionType(
  LocationResponseDto,
  PostCount,
) {}

// 게시글 수만 포함한 DTO
export class PostCountResponseDto extends PickType(LocationWithPostCountDto, [
  'postCount',
] as const) {}

// 새로운 getCitiesByProvince API를 위한 DTO
export class ProvinceCitiesResponseDto {
  @ApiProperty({ example: '서울특별시', description: '시/도 이름' })
  province: string;

  @ApiProperty({
    example: ['강남구', '강동구', '강북구'],
    description: '해당 광역시/특별시/도의 구/시 목록',
  })
  cities: string[];
}
