import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TagResponseDto, CreateTagDto } from './dto/tag.dto';

@ApiTags('태그')
@Controller('tags')
export class TagController {
  @Get()
  @ApiOperation({
    summary: '모든 태그 조회',
    description: '모든 태그를 조회합니다. (예: 가이드 친구, 운전기사 친구 등)',
  })
  @ApiResponse({
    status: 200,
    description: '태그 목록',
    type: [TagResponseDto],
  })
  getAllTags(): TagResponseDto[] {
    // 구현 내용
    return [];
  }

  @Post()
  @ApiOperation({
    summary: '새 태그 생성',
    description: '새로운 태그를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '태그 생성 성공',
    type: TagResponseDto,
  })
  createTag(@Body() createTagDto: CreateTagDto): TagResponseDto {
    // 구현 내용
    return {} as TagResponseDto;
  }
}
