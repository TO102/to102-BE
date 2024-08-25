import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { User } from '../../entities/user.entity';

export class UserResponseDto extends PickType(User, [
  'userId',
  'username',
  'nickname',
  'email',
  'profilePictureUrl',
  'createdAt',
  'updatedAt',
  'lastLogin',
  'averageRating',
] as const) {}

export class UsernameUpdateDto {
  @ApiProperty({ example: 'new_username', description: '새로운 사용자 이름' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;
}

export class VerifyLocationDto {
  @ApiProperty({ example: 37.5665, description: '위도' })
  latitude: number;

  @ApiProperty({ example: 126.978, description: '경도' })
  longitude: number;
}

export class PostBriefDto {
  @ApiProperty({ example: 1, description: '게시글 고유 식별자' })
  id: number;

  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  title: string;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '게시글 작성 시간',
  })
  createdAt: Date;
}
