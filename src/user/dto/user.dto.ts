import { ApiProperty, PickType, OmitType } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: '사용자 고유 식별자' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: '사용자 이름' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: 'password123', description: '사용자 비밀번호' })
  password: string;

  @ApiProperty({ example: '서울시 강남구', description: '사용자 위치' })
  location: string;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '사용자 가입 시간',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-13T12:30:00Z',
    description: '마지막 로그인 시간',
  })
  lastLoginAt: Date;
}

export class UserResponseDto extends OmitType(User, ['password'] as const) {}

export class UpdateUserDto extends PickType(User, [
  'username',
  'email',
  'location',
] as const) {}

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
