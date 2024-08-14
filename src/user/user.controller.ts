import { Controller, Get, Put, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  UserResponseDto,
  UpdateUserDto,
  VerifyLocationDto,
  PostBriefDto,
} from './dto/user.dto';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  @Get(':id')
  @ApiOperation({
    summary: '특정 사용자 조회',
    description: '지정된 ID의 사용자 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보',
    type: UserResponseDto,
  })
  getUserById(@Param('id') id: string): UserResponseDto {
    // 구현 내용
    return {} as UserResponseDto;
  }

  @Put(':id')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '지정된 ID의 사용자 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '수정된 사용자 정보',
    type: UserResponseDto,
  })
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): UserResponseDto {
    // 구현 내용
    return {} as UserResponseDto;
  }

  @Get(':id/posts')
  @ApiOperation({
    summary: '특정 사용자의 게시글 조회',
    description: '지정된 ID의 사용자가 작성한 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '사용자의 게시글 목록',
    type: [PostBriefDto],
  })
  getUserPosts(@Param('id') id: string): PostBriefDto[] {
    // 구현 내용
    return [];
  }

  @Post(':id/verify-location')
  @ApiOperation({
    summary: '사용자 위치 인증',
    description: 'GPS 정보를 사용하여 사용자의 위치를 인증합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '위치 인증 성공', type: Boolean })
  verifyLocation(
    @Param('id') id: string,
    @Body() verifyLocationDto: VerifyLocationDto,
  ): boolean {
    // 구현 내용
    return true;
  }
}
