import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../user/user.repository';
import { User } from 'src/entities/user.entity';
import { URLSearchParams } from 'url';
import axios from 'axios';

interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async getKakaoToken(code: string): Promise<string> {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.get('KAKAO_CLIENT_ID'),
      redirect_uri: this.configService.get('KAKAO_CALLBACK_URL'),
      code,
    });

    try {
      console.log('Requesting Kakao token with params:', params.toString());
      const response = await axios.post(tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('Kakao token response:', response.data);
      return response.data.access_token;
    } catch (error) {
      console.error(
        'Error getting Kakao token:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException(
        '카카오 토큰을 가져오는데 실패하였습니다.',
      );
    }
  }
  async getKakaoUserInfo(access_token: string): Promise<any> {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data;
    } catch (error) {
      throw new UnauthorizedException(
        '카카오 유저 정보를 가져오는데 실패하였습니다.',
      );
    }
  }
  // async kakaoLogin(code: string): Promise<LoginResult> {
  //   const kakaoToken = await this.getKakaoToken(code);
  //   const kakaoUserData = await this.getKakaoUserInfo(kakaoToken);

  //   const user = await this.usersRepository.findOrCreateByOAuthId(
  //     'kakao',
  //     kakaoUserData.id,
  //     {
  //       nickname: kakaoUserData.kakao_account.profile.nickname,
  //       email: kakaoUserData.kakao_account.email,
  //       profile_picture_url:
  //         kakaoUserData.kakao_account.profile.profile_image_url,
  //     },
  //   );
  //   await this.usersRepository.updateLastLogin(user.user_id);
  //   const { accessToken, refreshToken } = await this.getTokens(user);
  //   return { user, accessToken, refreshToken };
  // }
  async kakaoLogin(code: string): Promise<LoginResult> {
    try {
      console.log('Starting kakaoLogin with code:', code);

      const kakaoToken = await this.getKakaoToken(code);
      console.log('Received Kakao token:', kakaoToken);

      const kakaoUserData = await this.getKakaoUserInfo(kakaoToken);
      console.log('Received Kakao user data:', kakaoUserData);

      const user = await this.usersRepository.findOrCreateByOAuthId(
        'kakao',
        kakaoUserData.id,
        {
          nickname: kakaoUserData.kakao_account.profile.nickname,
          email: kakaoUserData.kakao_account.email,
          profile_picture_url:
            kakaoUserData.kakao_account.profile.profile_image_url,
        },
      );
      console.log('User found or created:', user);

      await this.usersRepository.updateLastLogin(user.userId);
      const { accessToken, refreshToken } = await this.getTokens(user);

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Error in kakaoLogin:', error);
      throw error;
    }
  }

  async getTokens(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  generateAccessToken(user: User): string {
    const payload = { userId: user.userId };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { userId: user.userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.setCurrentRefreshToken(
      user.userId,
      hashedRefreshToken,
    );

    return refreshToken;
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersRepository.getUserWithCurrentRefreshToken(
        payload.userId,
      );

      if (
        !user ||
        !(await bcrypt.compare(refreshToken, user.currentRefreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAccessToken(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
