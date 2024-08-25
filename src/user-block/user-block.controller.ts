import { Controller, Post, Delete, Param, Body, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { BlockService } from './user-block.service';
import { UserBlock } from 'src/entities/user-block.entity';

@ApiTags('사용자 차단')
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @ApiOperation({
    summary: '사용자 차단',
    description: '특정 사용자를 차단합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 차단되었습니다.',
    type: UserBlock,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blockerId: {
          type: 'integer',
          description: '차단을 수행하는 사용자 ID',
        },
        blockedId: {
          type: 'integer',
          description: '차단당하는 사용자 ID',
        },
      },
      required: ['blockerId', 'blockedId'],
    },
  })
  async blockUser(
    @Body('blockerId') blockerId: number,
    @Body('blockedId') blockedId: number,
  ): Promise<UserBlock> {
    return this.blockService.blockUser(blockerId, blockedId);
  }

  @Delete()
  @ApiOperation({
    summary: '사용자 차단 해제',
    description: '특정 사용자에 대한 차단을 해제합니다.',
  })
  @ApiResponse({
    status: 204,
    description: '차단이 성공적으로 해제되었습니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blockerId: {
          type: 'integer',
          description: '차단을 해제하는 사용자 ID',
        },
        blockedId: {
          type: 'integer',
          description: '차단이 해제될 사용자 ID',
        },
      },
      required: ['blockerId', 'blockedId'],
    },
  })
  async unblockUser(
    @Body('blockerId') blockerId: number,
    @Body('blockedId') blockedId: number,
  ): Promise<void> {
    return this.blockService.unblockUser(blockerId, blockedId);
  }

  @Get(':blockerId/blocked/:blockedId')
  @ApiOperation({
    summary: '차단 여부 확인',
    description: '특정 사용자가 다른 사용자를 차단했는지 여부를 확인합니다.',
  })
  @ApiParam({ name: 'blockerId', description: '차단한 사용자 ID' })
  @ApiParam({ name: 'blockedId', description: '차단된 사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '차단 여부를 반환합니다.',
    type: Boolean,
  })
  async isBlocked(
    @Param('blockerId') blockerId: number,
    @Param('blockedId') blockedId: number,
  ): Promise<boolean> {
    return this.blockService.isBlocked(blockerId, blockedId);
  }
}
