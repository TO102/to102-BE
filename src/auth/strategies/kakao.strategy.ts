import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      clientSecret: '', // 카카오는 clientSecret을 사용하지 않습니다.
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
      scope: ['profile_nickname', 'account_email'], // 필요한 scope 설정
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ): Promise<any> {
    const { id, username, emails, _json } = profile;
    console.log('카카오 인증 응답:', {
      id,
      username,
      email: emails && emails.length > 0 ? emails[0].value : null,
      profileImage: _json.properties?.profile_image,
    });

    // 유저를 검증하거나 생성
    let user = await this.authService.validateUser('kakao', id);

    // 유저 정보 업데이트
    user.nickname = username || user.nickname;
    user.email = emails && emails.length > 0 ? emails[0].value : user.email;
    user.profilePictureUrl =
      _json.properties?.profile_image || user.profilePictureUrl;

    user = await this.authService.updateUser(user);

    console.log('업데이트된 사용자 정보:', {
      id: user.userId,
      nickname: user.nickname,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    });

    // 인증 완료 후 done 콜백 호출
    done(null, user);
  }
}
