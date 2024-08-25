import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(oauthProvider: string, oauthId: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { oauthProvider, oauthId },
    });

    if (!user) {
      user = this.userRepository.create({
        oauthProvider,
        oauthId,
        nickname: '',
        email: '',
        profilePictureUrl: '',
      });

      await this.userRepository.save(user);
      this.logger.log(`새로운 사용자 생성: ${user.oauthId}`);
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.userId,
      oauthId: user.oauthId,
      nickname: user.nickname,
    };
    this.logger.log(`로그인 payload 생성: ${JSON.stringify(payload)}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(user: User): Promise<User> {
    this.logger.log(`사용자 업데이트: ${user.oauthId}`);
    return await this.userRepository.save(user);
  }

  async getKakaoToken(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: this.configService.get('KAKAO_CLIENT_ID'),
            redirect_uri: this.configService.get('KAKAO_CALLBACK_URL'),
            code: code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
    } catch (error) {
      this.logger.error(
        '카카오 토큰 가져오기 실패:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getKakaoUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, kakao_account, properties } = response.data;
    return {
      id: id.toString(),
      nickname: properties.nickname,
      email: kakao_account.email,
      profile_image: properties.profile_image,
    };
  }

  async processKakaoLogin(code: string) {
    const kakaoToken = await this.getKakaoToken(code);
    const userInfo = await this.getKakaoUserInfo(kakaoToken.access_token);

    this.logger.log('카카오 유저 정보:', userInfo);

    let user = await this.userRepository.findOne({
      where: { oauthProvider: 'kakao', oauthId: userInfo.id },
    });

    if (!user) {
      // 새 사용자 생성
      user = this.userRepository.create({
        oauthProvider: 'kakao',
        oauthId: userInfo.id,
        nickname: userInfo.nickname,
        email: userInfo.email,
        profilePictureUrl: userInfo.profile_image,
        currentRefreshToken: kakaoToken.refresh_token,
      });
      this.logger.log('유저 정보 새로 DB에 저장:', user);
    } else {
      // 기존 사용자 정보 업데이트
      user.nickname = userInfo.nickname;
      user.email = userInfo.email;
      user.profilePictureUrl = userInfo.profile_image;
      this.logger.log('기존 유저 정보 업데이트:', user);
    }

    // 사용자 정보 저장 또는 업데이트
    await this.userRepository.save(user);

    return kakaoToken.access_token;
  }
}
