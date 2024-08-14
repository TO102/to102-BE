import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateReviewDto,
  ReviewResponseDto,
  AISummaryDto,
} from './dto/review.dto';

@ApiTags('리뷰')
@Controller('reviews')
export class ReviewController {
  @Post()
  @ApiOperation({
    summary: '새 리뷰 작성',
    description: '새로운 리뷰를 작성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
    type: ReviewResponseDto,
  })
  createReview(@Body() createReviewDto: CreateReviewDto): ReviewResponseDto {
    // 구현 내용
    return {} as ReviewResponseDto;
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '특정 사용자에 대한 리뷰 조회',
    description: '지정된 사용자에 대한 모든 리뷰를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '리뷰 대상 사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '리뷰 목록',
    type: [ReviewResponseDto],
  })
  getUserReviews(@Param('userId') userId: string): ReviewResponseDto[] {
    // 구현 내용
    return [];
  }

  @Get('ai-summary/:userId')
  @ApiOperation({
    summary: '사용자의 AI 기반 한줄 평가',
    description: 'AI가 생성한 사용자에 대한 한줄 평가를 조회합니다.',
  })
  @ApiParam({ name: 'userId', description: '평가 대상 사용자 ID' })
  @ApiResponse({
    status: 200,
    description: 'AI 기반 평가 요약',
    type: AISummaryDto,
  })
  getAISummary(@Param('userId') userId: string): AISummaryDto {
    // 구현 내용
    return {} as AISummaryDto;
  }
}
