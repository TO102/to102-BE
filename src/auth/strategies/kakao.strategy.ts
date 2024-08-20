import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
      //scope: ['profile_nickname', 'profile_image', 'account_email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    // Implement validation logic
    const { id, username, _json } = profile;
    const user = {
      id,
      username,
      kakao_account: _json.kakao_account,
    };
    done(null, user);
  }
}
