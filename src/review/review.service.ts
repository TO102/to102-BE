import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto, ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<ReviewDto> {
    const { reviewerId, reviewedId, rating, content } = createReviewDto;

    // 리뷰어(리뷰 작성자) 존재 확인
    const reviewer = await this.userRepository.findOne({
      where: { userId: reviewerId },
    });
    if (!reviewer) {
      throw new NotFoundException('리뷰 작성자를 찾을 수 없습니다.');
    }

    // 리뷰 대상자 존재 확인
    const reviewed = await this.userRepository.findOne({
      where: { userId: reviewedId },
    });
    if (!reviewed) {
      throw new NotFoundException('리뷰 대상자를 찾을 수 없습니다.');
    }

    // 점수 유효성 체크 (0~5 사이의 값)
    if (rating < 0 || rating > 5) {
      throw new BadRequestException('평점은 0과 5 사이의 값이어야 합니다.');
    }

    // 리뷰 생성 및 저장
    const review = this.reviewRepository.create({
      reviewer,
      reviewed,
      rating,
      content,
    });

    const savedReview = await this.reviewRepository.save(review);

    return this.toReviewDto(savedReview);
  }

  private toReviewDto(review: Review): ReviewDto {
    return {
      review_id: review.review_id,
      rating: review.rating,
      content: review.content,
      created_at: review.created_at,
      reviewer: {
        userId: review.reviewer.userId,
        username: review.reviewer.username,
        profilePictureUrl: review.reviewer.profilePictureUrl,
      },
    };
  }

  async getReviewsForUser(userId: number): Promise<ReviewDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { reviewed: { userId } },
      relations: ['reviewer'],
      order: { created_at: 'DESC' },
    });

    if (!reviews.length) {
      throw new NotFoundException('해당 사용자의 리뷰를 찾을 수 없습니다.');
    }

    return reviews.map((review) => this.toReviewDto(review));
  }
}
