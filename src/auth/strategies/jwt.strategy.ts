import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(private readonly configService: ConfigService) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.cookies.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload) {
    return { userId: payload.userId };
  }
}
