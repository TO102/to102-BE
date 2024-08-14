import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  LocationResponseDto,
  LocationWithPostCountDto,
  PostCountResponseDto,
} from './dto/location.dto';

@ApiTags('위치')
@Controller('locations')
export class LocationController {
  @Get()
  @ApiOperation({
    summary: '모든 위치 정보 조회',
    description: '전국의 모든 위치 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '위치 정보 목록',
    type: [LocationResponseDto],
  })
  getAllLocations(): LocationResponseDto[] {
    // 구현 내용
    return [];
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 위치 정보 조회',
    description: '지정된 ID의 위치 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '위치 ID' })
  @ApiResponse({
    status: 200,
    description: '위치 정보',
    type: LocationResponseDto,
  })
  getLocationById(@Param('id') id: string): LocationResponseDto {
    // 구현 내용
    return {} as LocationResponseDto;
  }

  @Get(':id/posts/count')
  @ApiOperation({
    summary: '특정 지역의 게시글 수 조회',
    description: '지정된 위치 ID에 해당하는 지역의 게시글 수를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '위치 ID' })
  @ApiResponse({
    status: 200,
    description: '게시글 수를 포함한 위치 정보',
    type: LocationWithPostCountDto,
  })
  getPostCountByLocation(@Param('id') id: string): LocationWithPostCountDto {
    // 구현 내용
    return {} as LocationWithPostCountDto;
  }
}
