import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger';
import { Location } from '../../entities/location.entity';

// 기본 주소 정보 DTO
export class AddressInfo extends PickType(Location, [
  'province',
  'city',
  'district',
] as const) {}

// 위치 응답 DTO
export class LocationResponseDto extends PickType(Location, [
  'locationId',
  'province',
  'city',
  'district',
] as const) {}

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

export class ProvinceCitiesResponseDto {
  @ApiProperty({ example: '서울특별시', description: '시/도 이름' })
  province: string;

  @ApiProperty({
    example: ['강남구', '강동구', '강북구'],
    description: '해당 광역시/특별시/도의 구/시 목록',
  })
  cities: string[];
}

export class ProvinceResponseDto {
  @ApiProperty({
    example: ['서울특별시', '부산광역시', '기타 다른 광역시/특별시/도 정보'],
    description: '광역시/특별시/도 목록',
  })
  provinces: string[];
}
