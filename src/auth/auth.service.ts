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
    const payload = { oauthId: user.oauthId, nickname: user.nickname };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(user: User): Promise<User> {
    this.logger.log(`사용자 업데이트: ${user.oauthId}`);
    return await this.userRepository.save(user);
  }

  public async getKakaoToken(code: string): Promise<{ access_token: string }> {
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: this.configService.get('KAKAO_CLIENT_ID'),
          redirect_uri: this.configService.get('KAKAO_REDIRECT_URI'),
          code: code,
        },
      },
    );

    return { access_token: response.data.access_token };
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

    console.log('카카오에서 받은 사용자 정보:', userInfo);

    let user = await this.validateUser('kakao', userInfo.id);

    user.nickname = userInfo.nickname || user.nickname;
    user.email = userInfo.email || user.email;
    user.profilePictureUrl = userInfo.profile_image || user.profilePictureUrl;

    user = await this.updateUser(user);

    console.log('데이터베이스에 저장된 사용자 정보:', {
      id: user.userId,
      nickname: user.nickname,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    });

    return this.login(user);
  }
}
