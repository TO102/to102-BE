import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AddressInfo, LocationResponseDto } from './dto/location.dto';
import { LocationService } from './location.service';

@ApiTags('위치')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('address')
  @ApiOperation({
    summary: '좌표로부터 위치 정보 조회',
    description: '위도와 경도를 바탕으로 현재 위치 정보를 반환합니다.',
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
    status: 200,
    description: '위치 정보',
    type: AddressInfo,
  })
  async getAddressFromCoordinates(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ): Promise<AddressInfo> {
    return this.locationService.getAddressFromCoordinates(latitude, longitude);
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
