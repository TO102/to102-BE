import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto, LatestPostDto, ResponsePostDto } from './dto/post.dto';
import { User } from 'src/entities/user.entity';
import { Location } from '../entities/location.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private authService: AuthService,
  ) {}

  async createPost(
    accessToken: string,
    createPostDto: CreatePostDto,
  ): Promise<ResponsePostDto> {
    const { title, content, status, thumbnail, province, city, postTags } =
      createPostDto;

    // 액세스 토큰을 이용해 사용자 정보 가져오기
    const user = await this.authService.getKakaoUserInfo(accessToken);

    if (!user) {
      throw new NotFoundException('유효하지 않은 토큰입니다.');
    }

    // 유저의 위치 정보를 조회
    const userWithLocation = await this.userRepository.findOne({
      where: { userId: user.userId },
      relations: ['location'],
    });

    if (!userWithLocation || !userWithLocation.location) {
      throw new NotFoundException('사용자의 위치 정보를 찾을 수 없습니다.');
    }

    // 유저의 위치(province, city)와 클라이언트에서 전달된 province, city 비교
    if (
      userWithLocation.location.province !== province ||
      userWithLocation.location.city !== city
    ) {
      throw new BadRequestException(
        '사용자의 위치와 글을 작성하려는 위치가 일치하지 않습니다.',
      );
    }

    // 게시글 생성
    const post = this.postRepository.create({
      title,
      content,
      thumbnail,
      status,
      user: userWithLocation,
      province,
      city,
      postTags,
    });

    // 게시글 저장
    await this.postRepository.save(post);

    return {
      postId: post.postId,
      title: post.title,
      thumbnail: post.thumbnail,
      content: post.content,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.user.userId,
      province: post.province,
      city: post.city,
      postTags: post.postTags,
    };
  }
}
