import { Request } from 'express';
import { User } from 'src/entities/user.entity';

export interface KakaoUser {
  id: string;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export interface RequestWithKakaoUser extends Request {
  user: KakaoUser;
}

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
