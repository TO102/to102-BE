import { ApiProperty, PickType, OmitType } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: 1,
    description: '사용자 고유 식별자',
  })
  id: number;

  @ApiProperty({
    example: 'john_doe',
    description: '사용자 이름',
  })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: '사용자 이메일',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '사용자 비밀번호',
  })
  password: string;

  @ApiProperty({
    example: '서울',
    description: '사용자 위치',
  })
  location: string;
}

export class KakaoLoginDto {
  @ApiProperty({
    example: 'kakao_access_token_here',
    description: '카카오 OAuth 액세스 토큰',
  })
  accessToken: string;
}

export class RegisterDto extends PickType(User, [
  'username',
  'email',
  'password',
] as const) {}

export class UserResponseDto extends OmitType(User, ['password'] as const) {}
