import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestWithKakaoUser } from './auth.types';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 OAuth 로그인',
    description: '카카오 로그인을 처리합니다.',
  })
  @ApiResponse({ status: 301, description: '로그인 성공 및 리다이렉트' })
  @HttpCode(301)
  async kakaoLogin(@Req() req: RequestWithKakaoUser, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, accessToken, refreshToken } =
      await this.authService.kakaoLogin(req.user);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', 'true', { httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  @Get('refresh')
  @ApiOperation({
    summary: '토큰 갱신',
    description: 'Refresh 토큰을 사용하여 새 Access 토큰을 발급합니다.',
  })
  @ApiResponse({ status: 200, description: '토큰 갱신 성공' })
  @HttpCode(200)
  async refresh(@Req() req: RequestWithKakaoUser, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    this.logger.debug(`Refresh token from cookies: ${refreshToken}`);

    if (!refreshToken) {
      this.logger.error('Refresh token not found in cookies');
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const newAccessToken = await this.authService.refresh(refreshToken);
      //this.logger.debug(`old access token : ${req.cookies?.accessToken}, new Access token : ${newAccessToken}`,);
      res.clearCookie('accessToken');
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      return res.send({ message: 'Access token refreshed successfully' });
    } catch (err) {
      this.logger.error(`Error refreshing token: ${err.message}`);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '사용자를 로그아웃 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @HttpCode(200)
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('isLoggedIn');
    return res.send({ message: 'Logged out successfully' });
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 OAuth 콜백',
    description: '카카오 로그인 후 콜백을 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '카카오 인증 성공' })
  async kakaoCallback(@Req() req: RequestWithKakaoUser, @Res() res: Response) {
    try {
      const { user, accessToken, refreshToken } =
        await this.authService.kakaoLogin(req.user);
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.cookie('isLoggedIn', 'true', { httpOnly: false });

      return res.json({
        message: '카카오 인증이 성공적으로 완료되었습니다.',
        user: { id: user.userId, email: user.email },
      });
    } catch (error) {
      this.logger.error('카카오 인증 처리 중 오류 발생:', error);
      if (error.response) {
        this.logger.error('카카오 API 응답:', error.response.data);
      }
      return res
        .status(500)
        .json({ message: '카카오 인증 처리 중 오류가 발생했습니다.' });
    }
  }
}
