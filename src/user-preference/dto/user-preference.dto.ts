import { ApiProperty, PickType } from '@nestjs/swagger';

export class UserPreference {
  @ApiProperty({ example: 1, description: '사용자 설정 고유 식별자' })
  id: number;

  @ApiProperty({ example: 1, description: '사용자 ID' })
  userId: number;

  @ApiProperty({ example: true, description: '알림 활성화 여부' })
  notificationsEnabled: boolean;

  @ApiProperty({
    example: ['post', 'message'],
    description: '알림을 받을 이벤트 유형',
  })
  notificationTypes: string[];

  @ApiProperty({ example: 'dark', description: '선호하는 테마' })
  theme: 'light' | 'dark';

  @ApiProperty({ example: 'ko', description: '선호하는 언어' })
  language: string;

  @ApiProperty({ example: { postRadius: 5 }, description: '추가 설정' })
  additionalSettings: Record<string, any>;
}

export class UserPreferenceResponseDto extends PickType(UserPreference, [
  'notificationsEnabled',
  'notificationTypes',
  'theme',
  'language',
  'additionalSettings',
] as const) {}

export class UpdateUserPreferenceDto extends PickType(UserPreference, [
  'notificationsEnabled',
  'notificationTypes',
  'theme',
  'language',
  'additionalSettings',
] as const) {
  @ApiProperty({ required: false })
  notificationsEnabled?: boolean;

  @ApiProperty({ required: false })
  notificationTypes?: string[];

  @ApiProperty({ required: false })
  theme?: 'light' | 'dark';

  @ApiProperty({ required: false })
  language?: string;

  @ApiProperty({ required: false })
  additionalSettings?: Record<string, any>;
}
