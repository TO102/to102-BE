import { Controller, Get, HttpStatus, Param, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  LocationResponseDto,
  ProvinceCitiesResponseDto,
  ProvinceResponseDto,
} from './dto/location.dto';
import { LocationService } from './location.service';

@ApiTags('위치')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Put('user/:id')
  @ApiOperation({
    summary: '사용자 위치 정보 업데이트',
    description:
      '사용자 ID와 좌표를 받아 해당 사용자의 위치 정보를 업데이트합니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 ID',
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    example: 37.5665,
    description: '위도',
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    example: 126.978,
    description: '경도',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '업데이트된 위치 정보',
    type: LocationResponseDto,
  })
  async updateUserLocation(
    @Param('id') userId: number,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ): Promise<LocationResponseDto> {
    return this.locationService.updateUserLocation(userId, latitude, longitude);
  }

  @Get('province')
  @ApiOperation({
    summary: '모든 광역시/특별시/도 요소',
    description: '모든 광역시/특별시/도의 정보를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '광역시/특별시/도 정보',
    type: ProvinceResponseDto,
  })
  async getProvince(): Promise<ProvinceResponseDto> {
    return this.locationService.getProvinces();
  }

  @Get('province/:province')
  @ApiOperation({
    summary: '광역시/특별시/도 정보 조회',
    description:
      '광역시/특별시/도 정보를 파라미터로 받아 시/군/구 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'province',
    description: '광역시/특별시/도',
    example: '서울특별시',
  })
  @ApiResponse({
    status: 200,
    description: '시/군/구 정보',
    type: ProvinceCitiesResponseDto,
  })
  async getCitiesByProvince(
    @Param('province') province: string,
  ): Promise<ProvinceCitiesResponseDto> {
    return this.locationService.getCitiesByProvince(province);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 위치 정보 조회',
    description: '지정된 ID의 위치 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '위치 ID', example: 10 })
  @ApiResponse({
    status: 200,
    description: '위치 정보',
    type: LocationResponseDto,
  })
  getLocationById(@Param('id') id: number): Promise<LocationResponseDto> {
    return this.locationService.getLocationById(id);
  }
}
