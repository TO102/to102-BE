import { PickType } from '@nestjs/swagger';
import { Review } from '../../entities/review.entity';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto extends PickType(Review, [
  'rating',
  'content',
] as const) {
  @ApiProperty({ description: '리뷰 작성자의 사용자 ID' })
  @IsNumber()
  reviewerId: number;

  @ApiProperty({ description: '리뷰 대상자의 사용자 ID' })
  @IsNumber()
  reviewedId: number;
}
export class ReviewDto {
  @ApiProperty({ description: '리뷰 고유 식별자' })
  review_id: number;

  @ApiProperty({ description: '평점' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용' })
  content: string;

  @ApiProperty({ description: '리뷰 작성 시간' })
  created_at: Date;

  @ApiProperty({ description: '리뷰 작성자 정보' })
  reviewer: {
    userId: number;
    username: string;
    profilePictureUrl: string;
  };
}
