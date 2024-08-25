/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserResponseDto, UsernameUpdateDto } from './dto/user.dto';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUserById(id: number): Promise<User> {
    this.logger.log(`사용자 정보 조회 요청. ID: ${id}`);
    if (!id || isNaN(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUsername(
    id: number,
    usernameUpdateDto: UsernameUpdateDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 중복 검사
    const existingUser = await this.userRepository.findOne({
      where: { username: usernameUpdateDto.username },
    });
    if (existingUser && existingUser.userId !== id) {
      throw new HttpException(
        '이미 존재하는 사용자 이름입니다.',
        HttpStatus.CONFLICT,
      );
    }

    user.username = usernameUpdateDto.username;
    // updatedAt은 @UpdateDateColumn 데코레이터에 의해 자동으로 업데이트됨.

    const updatedUser = await this.userRepository.save(user);
    const { currentRefreshToken, ...userResponse } = updatedUser;
    return userResponse;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async getCurrentUserInfo(accessToken: string): Promise<User> {
    try {
      const kakaoUserInfo =
        await this.authService.getKakaoUserInfo(accessToken);

      const user = await this.userRepository.findOne({
        where: [
          { email: kakaoUserInfo.email },
          { nickname: kakaoUserInfo.nickname },
        ],
      });

      if (!user) {
        this.logger.warn(
          `유저에 해당하는 이메일: ${kakaoUserInfo.email} 또는 닉네임: ${kakaoUserInfo.nickname} 이 없습니다.`,
        );
        throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `현재 유저 정보를 반환하는데 실패하였습니다.: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('유저 정보를 반환하는데 실패하였습니다.');
    }
  }
}
