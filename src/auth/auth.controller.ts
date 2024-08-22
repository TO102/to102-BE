import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 카카오 로그인 진입점
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req, @Res() res) {
    console.log('카카오 로그인 콜백 호출됨');
    console.log('인증 코드:', req.query.code);

    const user = req.user;
    if (!user) {
      console.error('유효한 사용자를 찾을 수 없음');
      return res.status(400).json({ message: '유효한 사용자를 찾을 수 없음' });
    }

    console.log('사용자 정보:', user);

    const jwt = await this.authService.login(user);
    console.log('JWT 토큰 발급:', jwt);

    res.redirect(
      `${this.configService.get('CLIENT_URL')}/auth/kakao/callback?token=${jwt.access_token}`,
    );
  }
  @Post('kakao/token')
  async getTokenWithCode(@Body() body: { code: string }) {
    return this.authService.processKakaoLogin(body.code);
  }
}
