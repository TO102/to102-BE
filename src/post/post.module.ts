import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Tag } from '..//entities/tag.entity';
import { PostTag } from '..//entities/post-tag.entity';
import { Location } from '../entities/location.entity';
import { Post } from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Location, Tag, PostTag])],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
