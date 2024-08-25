import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Location } from '../entities/location.entity';
import { Post } from '../entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Location]), AuthModule],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
