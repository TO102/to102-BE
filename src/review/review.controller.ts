import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReviewDto } from './dto/review.dto';

@ApiTags('리뷰')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({
    summary: '리뷰 작성',
    description: '특정 사용자에 대한 리뷰를 작성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰가 성공적으로 작성되었습니다.',
    type: ReviewDto, // 반환 타입을 ReviewDto로 변경
  })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    // 반환 타입을 ReviewDto로 변경
    return this.reviewService.createReview(createReviewDto);
  }
  @Get(':userId')
  @ApiOperation({
    summary: '사용자에 대한 모든 리뷰 조회',
    description: '특정 사용자에 대해 작성된 모든 리뷰를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '리뷰 대상자의 사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록',
    type: [ReviewDto], // 반환 타입을 ReviewDto 배열로 변경
  })
  async getReviewsForUser(
    @Param('userId') userId: number,
  ): Promise<ReviewDto[]> {
    return this.reviewService.getReviewsForUser(userId);
  }
}
