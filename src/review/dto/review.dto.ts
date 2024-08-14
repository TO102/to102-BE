import { ApiProperty, PickType } from '@nestjs/swagger';

export class Review {
  @ApiProperty({ example: 1, description: '리뷰 고유 식별자' })
  id: number;

  @ApiProperty({ example: 1, description: '리뷰 작성자 ID' })
  reviewerId: number;

  @ApiProperty({ example: 2, description: '리뷰 대상 사용자 ID' })
  revieweeId: number;

  @ApiProperty({
    example: 4.5,
    description: '평점 (1~5)',
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    example: '친절하고 시간 약속을 잘 지켜요!',
    description: '리뷰 내용',
  })
  content: string;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '리뷰 작성 시간',
  })
  createdAt: Date;
}

export class CreateReviewDto extends PickType(Review, [
  'revieweeId',
  'rating',
  'content',
] as const) {}

export class ReviewResponseDto extends Review {}

export class AISummaryDto {
  @ApiProperty({
    example: '친절하고 신뢰할 수 있는 사용자입니다.',
    description: 'AI가 생성한 사용자 평가 요약',
  })
  summary: string;
}
