import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  UserPreferenceResponseDto,
  UpdateUserPreferenceDto,
} from './dto/user-preference.dto';

@ApiTags('사용자 설정')
@Controller('preferences')
export class UserPreferenceController {
  @Get(':userId')
  @ApiOperation({
    summary: '사용자 설정 조회',
    description: '지정된 사용자의 설정을 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 설정 정보',
    type: UserPreferenceResponseDto,
  })
  getUserPreference(
    @Param('userId') userId: string,
  ): UserPreferenceResponseDto {
    // 구현 내용
    return {} as UserPreferenceResponseDto;
  }

  @Put(':userId')
  @ApiOperation({
    summary: '사용자 설정 수정',
    description: '지정된 사용자의 설정을 수정합니다.',
  })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '수정된 사용자 설정 정보',
    type: UserPreferenceResponseDto,
  })
  updateUserPreference(
    @Param('userId') userId: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ): UserPreferenceResponseDto {
    // 구현 내용
    return {} as UserPreferenceResponseDto;
  }
}
