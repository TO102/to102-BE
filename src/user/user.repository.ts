import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreateByOAuthId(
    provider: string,
    oauthId: string,
    userData: any,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { oauthId: oauthId },
    });
    if (!user) {
      user = this.userRepository.create({
        oauthProvider: provider,
        oauthId: oauthId,
        nickname: userData.nickname,
        email: userData.email,
        profilePictureUrl: userData.profile_picture_url,
      });
      await this.userRepository.save(user);
    }
    return user;
  }

  async setCurrentRefreshToken(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      currentRefreshToken: hashedRefreshToken,
    });
  }

  async getUserWithCurrentRefreshToken(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      currentRefreshToken: null,
    });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async updateUser(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
    });
  }
}
