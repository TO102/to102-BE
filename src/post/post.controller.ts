import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePostDto, ResponsePostDto, LatestPostDto } from './dto/post.dto';
import { PostService } from './post.service';

@ApiTags('게시글')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: '새 게시글 작성' })
  @ApiResponse({
    status: 201,
    description: '게시글 생성 성공',
    type: ResponsePostDto,
  })
  @ApiQuery({
    name: 'access-token',
    required: true,
    description: '액세스 토큰',
  })
  async createPost(
    @Query('access-token') token: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponsePostDto> {
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }
    return this.postService.createPost(token, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 게시글 조회' })
  @ApiResponse({
    status: 200,
    description: '게시글 목록 조회 성공',
    type: [ResponsePostDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postService.getAllPosts(page, limit);
  }

  @Get('latest')
  @ApiOperation({
    summary: '최신 게시글 조회',
    description: '가장 최신의 게시글을 10개를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '최신 게시글 목록',
    type: [LatestPostDto],
  })
  getLatestPosts(): Promise<LatestPostDto[]> {
    // 구현 내용
    return this.postService.getLatestPosts();
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
    type: ResponsePostDto,
  })
  getPostById(@Param('id') id: string): ResponsePostDto {
    // 구현 내용
    return {} as ResponsePostDto;
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
    type: ResponsePostDto,
  })
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): ResponsePostDto {
    // 구현 내용
    return {} as ResponsePostDto;
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
    type: [ResponsePostDto],
  })
  getPostsByLocation(
    @Param('locationId') locationId: string,
  ): ResponsePostDto[] {
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
    type: [ResponsePostDto],
  })
  getPostsByTag(@Param('tagName') tagName: string): ResponsePostDto[] {
    // 구현 내용
    return [];
  }
}
