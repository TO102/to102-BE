import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { LatestPostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getLatestPosts(): Promise<LatestPostDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.location', 'location')
      .leftJoinAndSelect('post.postTags', 'postTags')
      .leftJoinAndSelect('postTags.tag', 'tag')
      .orderBy('post.created_at', 'DESC')
      .take(10)
      .getMany();

    return posts.map((post) => {
      const latestPostDto = new LatestPostDto();
      latestPostDto.id = post.postId;
      latestPostDto.title = post.title;
      latestPostDto.author = {
        id: post.user.userId,
        name: post.user.username,
      };
      latestPostDto.tags = post.postTags.map((postTag) => ({
        id: postTag.tag.tagId,
        name: postTag.tag.name,
      }));
      latestPostDto.location = {
        id: post.location.locationId,
        city: post.location.city,
        district: post.location.district,
      };
      return latestPostDto;
    });
  }
}
