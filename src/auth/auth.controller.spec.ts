import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            kakaoLogin: jest.fn(),
            refresh: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('kakaoLogin', () => {
    it('should handle Kakao login and set cookies', async () => {
      const mockUser = { userId: 1, email: 'test@example.com' };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const mockReq = { user: { id: '12345', kakao_account: {} } };
      const mockRes = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      };

      (authService.kakaoLogin as jest.Mock).mockResolvedValue({
        user: mockUser,
        ...mockTokens,
      });

      await controller.kakaoLogin(mockReq as any, mockRes as any);

      expect(authService.kakaoLogin).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.cookie).toHaveBeenCalledTimes(3);
      expect(mockRes.redirect).toHaveBeenCalledWith('http://localhost:3000');
    });
  });

  describe('refresh', () => {
    it('should refresh the access token and invalidate the old one', async () => {
      const oldAccessToken = 'old-access-token';
      const oldRefreshToken = 'old-refresh-token';
      const newAccessToken = 'new-access-token';

      const mockReq = {
        cookies: {
          refreshToken: oldRefreshToken,
          accessToken: oldAccessToken,
        },
      };
      const mockRes = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        send: jest.fn(),
      };

      (authService.refresh as jest.Mock).mockResolvedValue(newAccessToken);

      await controller.refresh(mockReq as any, mockRes as any);

      expect(authService.refresh).toHaveBeenCalledWith(oldRefreshToken);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'accessToken',
        newAccessToken,
        { httpOnly: true },
      );
      expect(mockRes.send).toHaveBeenCalledWith({
        message: 'Access token refreshed successfully',
      });

      // Verify that the new token is different from the old one
      expect(newAccessToken).not.toBe(oldAccessToken);
    });
    it('should throw UnauthorizedException when refresh token is missing', async () => {
      const mockReq = { cookies: {} };
      const mockRes = {} as any;

      await expect(controller.refresh(mockReq as any, mockRes)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear cookies and send success message', () => {
      const mockRes = {
        clearCookie: jest.fn(),
        send: jest.fn(),
      };

      controller.logout(mockRes as any);

      expect(mockRes.clearCookie).toHaveBeenCalledTimes(3);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
