import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../user/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  let jwtService: JwtService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
              if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
              return null;
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOrCreateByOAuthId: jest.fn(),
            updateLastLogin: jest.fn(),
            setCurrentRefreshToken: jest.fn(),
            getUserWithCurrentRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('kakaoLogin', () => {
    it('should login or create user and return tokens', async () => {
      const mockUser = { userId: 1, email: 'test@example.com' };
      const mockKakaoUser = {
        id: '12345',
        kakao_account: {
          profile: {
            nickname: 'Test User',
            profile_image_url: 'http://example.com/image.jpg',
          },
          email: 'test@example.com',
        },
      };

      (usersRepository.findOrCreateByOAuthId as jest.Mock).mockResolvedValue(
        mockUser,
      );
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');

      const result = await service.kakaoLogin(mockKakaoUser);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(usersRepository.findOrCreateByOAuthId).toHaveBeenCalledWith(
        'kakao',
        '12345',
        expect.any(Object),
      );
      expect(usersRepository.updateLastLogin).toHaveBeenCalledWith(
        mockUser.userId,
      );
    });
  });

  describe('refresh', () => {
    it('should return a new access token for a valid refresh token', async () => {
      const mockUser = {
        userId: 1,
        currentRefreshToken: 'hashed-refresh-token',
      };
      (jwtService.verify as jest.Mock).mockReturnValue({ userId: 1 });
      (
        usersRepository.getUserWithCurrentRefreshToken as jest.Mock
      ).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.refresh('valid-refresh-token');

      expect(result).toBe('test-token');
      expect(jwtService.verify).toHaveBeenCalledWith(
        'valid-refresh-token',
        expect.any(Object),
      );
      expect(
        usersRepository.getUserWithCurrentRefreshToken,
      ).toHaveBeenCalledWith(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'valid-refresh-token',
        'hashed-refresh-token',
      );
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh('invalid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
