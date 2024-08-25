import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UnauthorizedException,
  DefaultValuePipe,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePostDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
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

  @Get('lastest')
  @ApiOperation({ summary: '최신 게시글 조회' })
  @ApiResponse({
    status: 200,
    description: '최신 게시글 목록 조회 성공',
    type: [ResponsePostDto],
  })
  async getLatestPosts() {
    return this.postService.getLatestSixPosts();
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
  async getPostById(@Param('id') id: number): Promise<ResponsePostDto> {
    return this.postService.getPostById(id);
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
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponsePostDto> {
    try {
      const updatedPost = await this.postService.updatePost(id, updatePostDto);
      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('게시글 수정 중 오류가 발생했습니다.');
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '지정된 ID의 게시글을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글 삭제 성공' })
  async deletePost(@Param('id') id: number): Promise<void> {
    await this.postService.deletePost(id);
  }

  @Get('location/:city')
  @ApiOperation({
    summary: '특정 지역의 게시글 조회',
    description: '지정된 위치(city, 시/군/구)에 해당하는 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'city', description: '시/군/구 이름' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: '게시글 목록 조회 성공',
    type: [ResponsePostDto],
  })
  async getPostsByLocation(
    @Param('city') city: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{ posts: ResponsePostDto[]; total: number }> {
    return this.postService.getPostsByCity(city, page, limit);
  }

  @Get('tag/:tagName')
  @ApiOperation({
    summary: '특정 태그의 게시글 조회',
    description: '지정된 태그를 가진 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'tagName', description: '태그 이름' })
  @ApiResponse({
    status: 200,
    description: '게시글 목록 조회 성공',
    type: [ResponsePostDto],
  })
  async getPostsByTag(
    @Param('tagName') tagName: string,
  ): Promise<ResponsePostDto[]> {
    return this.postService.getPostsByTag(tagName);
  }
}
