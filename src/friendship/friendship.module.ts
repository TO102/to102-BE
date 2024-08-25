import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { Friendship } from '../entities/friendship.entity';
import { User } from '../entities/user.entity';
import { UserBlock } from 'src/entities/user-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User, UserBlock])],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
