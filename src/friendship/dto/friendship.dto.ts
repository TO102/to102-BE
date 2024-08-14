import { ApiProperty, PickType } from '@nestjs/swagger';

export class Friendship {
  @ApiProperty({ example: 1, description: '친구 관계 고유 식별자' })
  id: number;

  @ApiProperty({ example: 1, description: '요청을 보낸 사용자 ID' })
  requesterId: number;

  @ApiProperty({ example: 2, description: '요청을 받은 사용자 ID' })
  addresseeId: number;

  @ApiProperty({
    example: 'pending',
    description: '친구 관계 상태 (pending, accepted, rejected)',
  })
  status: 'pending' | 'accepted' | 'rejected';

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '친구 요청 생성 시간',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-13T12:30:00Z',
    description: '친구 관계 상태 변경 시간',
  })
  updatedAt: Date;
}

export class CreateFriendshipDto extends PickType(Friendship, [
  'addresseeId',
] as const) {}

export class UpdateFriendshipDto {
  @ApiProperty({
    example: 'accepted',
    description: '친구 요청에 대한 응답 (accepted 또는 rejected)',
  })
  response: 'accepted' | 'rejected';
}

export class FriendshipResponseDto extends Friendship {}

export class FriendBriefDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: '사용자 이름' })
  username: string;

  @ApiProperty({ example: 'accepted', description: '친구 관계 상태' })
  status: 'pending' | 'accepted' | 'rejected';
}
