import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { KakaoLoginDto, RegisterDto, UserResponseDto } from './dto/auth.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  @Post('kakao')
  @ApiOperation({
    summary: '카카오 OAuth 로그인',
    description: '카카오 액세스 토큰을 사용하여 로그인합니다.',
  })
  @ApiBody({ type: KakaoLoginDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: UserResponseDto,
  })
  kakaoLogin(@Body() kakaoLoginDto: KakaoLoginDto) {
    // 구현 내용
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '현재 사용자를 로그아웃 처리합니다.',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @HttpCode(HttpStatus.OK)
  logout() {
    // 구현 내용
  }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserResponseDto,
  })
  register(@Body() registerDto: RegisterDto) {
    // 구현 내용
  }

  @Delete('deactivate')
  @ApiOperation({
    summary: '회원 탈퇴',
    description:
      '현재 사용자 계정을 비활성화합니다. 30일 후 재가입 가능합니다.',
  })
  @ApiResponse({ status: 200, description: '계정 비활성화 성공' })
  deactivate() {
    // 구현 내용
  }

  @Get('me')
  @ApiOperation({
    summary: '현재 사용자 정보 조회',
    description: '인증된 현재 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: UserResponseDto,
  })
  getMe() {
    // 구현 내용
  }
}
