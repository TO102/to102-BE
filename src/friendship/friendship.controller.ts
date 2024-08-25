import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  FriendBriefDto,
  UpdateFriendshipStatusDto,
} from './dto/friendship.dto';
import { FriendshipService } from './friendship.service';
import { Friendship } from 'src/entities/friendship.entity';

@ApiTags('친구 관계')
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post(':user1Id/request/:user2Id')
  @ApiOperation({ summary: '친구 요청 보내기' })
  @ApiParam({ name: 'user1Id', description: '친구 요청을 보내는 사용자 ID' })
  @ApiParam({ name: 'user2Id', description: '친구 요청을 받는 사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '친구 요청이 성공적으로 전송되었습니다.',
    type: Friendship,
  })
  async sendFriendRequest(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
  ): Promise<Friendship> {
    return this.friendshipService.sendFriendRequest(user1Id, user2Id);
  }

  @Put(':user1Id/status/:user2Id')
  @ApiOperation({ summary: '친구 상태 업데이트' })
  @ApiParam({ name: 'user1Id', description: '상태를 변경하는 사용자 ID' })
  @ApiParam({ name: 'user2Id', description: '상대방 사용자 ID' })
  @ApiBody({
    description: '업데이트할 친구 상태 정보',
    type: UpdateFriendshipStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: '친구 상태가 성공적으로 업데이트되었습니다.',
    type: Friendship,
  })
  async updateFriendshipStatus(
    @Param('user1Id') user1Id: number,
    @Param('user2Id') user2Id: number,
    @Body() updateFriendshipStatusDto: UpdateFriendshipStatusDto,
  ): Promise<Friendship> {
    return this.friendshipService.updateFriendshipStatus(
      user1Id,
      user2Id,
      updateFriendshipStatusDto.status,
    );
  }
  @Get(':userId')
  @ApiOperation({
    summary: '사용자의 모든 친구 관계 조회',
    description: '현재 사용자의 모든 친구 관계를 조회합니다.',
  })
  @ApiParam({ name: 'userId', required: true, description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '친구 목록',
    type: [FriendBriefDto],
  })
  async getMutualFriendById(
    @Param('userId') userId: number,
  ): Promise<FriendBriefDto[]> {
    return this.friendshipService.getMutualFriendById(userId);
  }
  @Delete(':id')
  @ApiOperation({
    summary: '친구 관계 삭제',
    description: '특정 친구 관계를 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '친구 관계 ID' })
  @ApiResponse({ status: 204, description: '친구 관계 삭제 성공' })
  async deleteFriendship(@Param('id') id: number) {
    await this.friendshipService.deleteFriendship(id);
  }
}
