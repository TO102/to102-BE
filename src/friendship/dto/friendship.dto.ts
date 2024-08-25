import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class UpdateFriendshipDto {
  @ApiProperty({
    example: 'accepted',
    description: '친구 요청에 대한 응답 (accepted 또는 rejected)',
  })
  response: 'accepted' | 'rejected';
}

export class FriendBriefDto extends PickType(User, [
  'userId',
  'username',
  'profilePictureUrl',
] as const) {}

export class UpdateFriendshipStatusDto {
  @ApiProperty({
    description: '새로운 친구 상태',
    enum: ['accepted', 'rejected', 'cancelled'],
  })
  @IsEnum(['accepted', 'rejected', 'cancelled'])
  status: 'accepted' | 'rejected' | 'cancelled';
}
