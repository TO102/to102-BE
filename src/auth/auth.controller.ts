import { Controller, Get, Logger, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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
  async kakaoCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      this.logger.log(`Received Kakao auth code: ${code}`);

      // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_API_URL}/auth/kakao/callback`;
      // 프론트엔드에서 위와 같은 주소로 카카오 서버에 요청 보냄.
      // 이 컨트롤러로 요청이 쿼리를 통해 인가코드와 함께 요청이 들어옴.
      // 인가코드를 통해서 카카오 액세스 토큰(인증코드)를 발급받는다.
      const access_token = await this.authService.processKakaoLogin(code);

      const redirectUrl = new URL(
        `${this.configService.get('CLIENT_URL')}/auth/kakao/callback`,
      ); //
      redirectUrl.searchParams.append('token', access_token);

      this.logger.log(`프론트로 리다이렉트 : ${redirectUrl.toString()}`);
      res.redirect(redirectUrl.toString());
    } catch (error) {
      this.logger.error('카카오 로그인 실패:', error);
      res.redirect(
        `${this.configService.get('CLIENT_URL')}/login?error=kakao_login_failed`,
      );
    }
  }
}
