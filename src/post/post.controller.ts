import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreatePostDto,
  UpdatePostDto,
  PostResponseDto,
  PopularPostDto,
} from './dto/post.dto';

@ApiTags('게시글')
@Controller('posts')
export class PostController {
  @Post()
  @ApiOperation({
    summary: '새 게시글 작성',
    description: '새로운 게시글을 작성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '게시글 생성 성공',
    type: PostResponseDto,
  })
  createPost(@Body() createPostDto: CreatePostDto): PostResponseDto {
    // 구현 내용
    return {} as PostResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: '모든 게시글 조회',
    description: '모든 게시글을 조회합니다. 정렬 옵션을 포함할 수 있습니다.',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: '정렬 옵션 (예: createdAt:desc)',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 목록',
    type: [PostResponseDto],
  })
  getAllPosts(@Query('sort') sort?: string): PostResponseDto[] {
    // 구현 내용
    return [];
  }

  @Get('popular')
  @ApiOperation({
    summary: '인기 게시글 조회',
    description: '인기 있는 게시글을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '인기 게시글 목록',
    type: [PopularPostDto],
  })
  getPopularPosts(): PopularPostDto[] {
    // 구현 내용
    return [];
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 게시글 조회',
    description: '지정된 ID의 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({
    status: 200,
    description: '게시글 정보',
    type: PostResponseDto,
  })
  getPostById(@Param('id') id: string): PostResponseDto {
    // 구현 내용
    return {} as PostResponseDto;
  }

  @Put(':id')
  @ApiOperation({
    summary: '게시글 수정',
    description: '지정된 ID의 게시글을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({
    status: 200,
    description: '수정된 게시글 정보',
    type: PostResponseDto,
  })
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): PostResponseDto {
    // 구현 내용
    return {} as PostResponseDto;
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '지정된 ID의 게시글을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글 삭제 성공' })
  deletePost(@Param('id') id: string): void {
    // 구현 내용
  }

  @Get('location/:locationId')
  @ApiOperation({
    summary: '특정 지역의 게시글 조회',
    description: '지정된 위치 ID에 해당하는 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'locationId', description: '위치 ID' })
  @ApiResponse({
    status: 200,
    description: '게시글 목록',
    type: [PostResponseDto],
  })
  getPostsByLocation(
    @Param('locationId') locationId: string,
  ): PostResponseDto[] {
    // 구현 내용
    return [];
  }

  @Get('tag/:tagName')
  @ApiOperation({
    summary: '특정 태그의 게시글 조회',
    description: '지정된 태그를 가진 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'tagName', description: '태그 이름' })
  @ApiResponse({
    status: 200,
    description: '게시글 목록',
    type: [PostResponseDto],
  })
  getPostsByTag(@Param('tagName') tagName: string): PostResponseDto[] {
    // 구현 내용
    return [];
  }
}
