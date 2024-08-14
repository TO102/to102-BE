import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateFriendshipDto,
  UpdateFriendshipDto,
  FriendshipResponseDto,
  FriendBriefDto,
} from './dto/friendship.dto';

@ApiTags('친구 관계')
@Controller('friendships')
export class FriendshipController {
  @Post()
  @ApiOperation({
    summary: '친구 요청 보내기',
    description: '새로운 친구 요청을 보냅니다.',
  })
  @ApiResponse({
    status: 201,
    description: '친구 요청 생성 성공',
    type: FriendshipResponseDto,
  })
  createFriendship(
    @Body() createFriendshipDto: CreateFriendshipDto,
  ): FriendshipResponseDto {
    // 구현 내용
    return {} as FriendshipResponseDto;
  }

  @Put(':id')
  @ApiOperation({
    summary: '친구 요청 수락/거절',
    description: '받은 친구 요청을 수락하거나 거절합니다.',
  })
  @ApiParam({ name: 'id', description: '친구 관계 ID' })
  @ApiResponse({
    status: 200,
    description: '친구 요청 응답 성공',
    type: FriendshipResponseDto,
  })
  updateFriendship(
    @Param('id') id: string,
    @Body() updateFriendshipDto: UpdateFriendshipDto,
  ): FriendshipResponseDto {
    // 구현 내용
    return {} as FriendshipResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: '사용자의 모든 친구 관계 조회',
    description: '현재 사용자의 모든 친구 관계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '친구 목록',
    type: [FriendBriefDto],
  })
  getAllFriendships(): FriendBriefDto[] {
    // 구현 내용
    return [];
  }

  @Delete(':id')
  @ApiOperation({
    summary: '친구 관계 삭제',
    description: '특정 친구 관계를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '친구 관계 ID' })
  @ApiResponse({ status: 204, description: '친구 관계 삭제 성공' })
  deleteFriendship(@Param('id') id: string): void {
    // 구현 내용
  }
}
