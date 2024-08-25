import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
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
  private mapPostsToResponseDtos(posts: Post[]): ResponsePostDto[] {
    return posts.map((post) => ({
      postId: post.postId,
      title: post.title,
      content: post.content,
      status: post.status,
      thumbnail: post.thumbnail,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.user.userId,
      province: post.province,
      city: post.city,
      postTags: post.postTags,
      meetingDate: post.meetingDate,
    }));
  }

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
      meetingDate: new Date(createPostDto.meetingDate), // 날짜로 변환
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
      meetingDate: post.meetingDate,
    };
  }
  private mapPostToResponseDto(post: Post): ResponsePostDto {
    const { user, ...postData } = post;
    return {
      ...postData,
      userId: user.userId,
    };
  }

  async getAllPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: ResponsePostDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    const responsePostDtos = this.mapPostsToResponseDtos(posts);

    return { posts: responsePostDtos, total };
  }

  async getLatestSixPosts(): Promise<{
    posts: ResponsePostDto[];
    total: number;
  }> {
    return this.getAllPosts(1, 6);
  }

  async getPostById(id: number): Promise<ResponsePostDto> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }

    return this.mapPostsToResponseDtos([post])[0];
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<ResponsePostDto> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }

    // 업데이트 가능한 필드만 명시적으로 나열
    const fieldsToUpdate = [
      'title',
      'content',
      'thumbnail',
      'status',
      'postTags',
      'meetingDate',
    ];

    for (const field of fieldsToUpdate) {
      if (updatePostDto[field] !== undefined) {
        post[field] = updatePostDto[field];
      }
    }

    await this.postRepository.save(post);
    return this.mapPostToResponseDto(post);
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
    });

    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }

    await this.postRepository.remove(post);
  }

  async getPostsByCity(
    city: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: ResponsePostDto[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      where: { city },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    if (total === 0) {
      throw new NotFoundException(
        `해당 지역(${city})에 대한 게시글을 찾을 수 없습니다.`,
      );
    }
    if (!posts || posts.length === 0) {
      throw new NotFoundException(
        `해당 지역(${city})에 대한 게시글을 찾을 수 없습니다.`,
      );
    }
    const responsePostDtos = this.mapPostsToResponseDtos(posts);
    return { posts: responsePostDtos, total };
  }
  async getPostsByTag(tagName: string): Promise<ResponsePostDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post."postTags"::jsonb @> :tagName', {
        tagName: `["${tagName}"]`,
      })
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    if (!posts || posts.length === 0) {
      throw new NotFoundException(
        `해당 태그(${tagName})가 포함된 게시글을 찾을 수 없습니다.`,
      );
    }

    return this.mapPostsToResponseDtos(posts);
  }
}
