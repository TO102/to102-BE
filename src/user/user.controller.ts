import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  HttpStatus,
  Logger,
  forwardRef,
  Inject,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserResponseDto, UsernameUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: '현재 로그인한 사용자 정보 조회',
    description:
      '액세스 토큰을 이용해 현재 로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiQuery({
    name: 'access_token',
    required: true,
    description: '액세스 토큰',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '현재 사용자 정보',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '유효하지 않은 토큰',
  })
  async getCurrentUser(
    @Query('access_token') token: string,
  ): Promise<UserResponseDto> {
    this.logger.log(
      `현재 사용자 정보 조회 요청. Token: ${token.substring(0, 10)}...`,
    );
    if (!token) {
      throw new UnauthorizedException('Access Token이 전달되지 않았습니다.');
    }

    try {
      const userInfo = await this.userService.getCurrentUserInfo(token);
      return userInfo;
    } catch (error) {
      this.logger.error(
        `현재 사용자의 토큰을 가져오는데 실패: ${error.message}`,
      );
      throw new UnauthorizedException('유효하지 않는 Access Token입니다.');
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 사용자 조회',
    description: '지정된 ID의 사용자 정보를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 정보',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '사용자를 찾을 수 없음',
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`특정 사용자 조회 요청. ID: ${id}`);
    return await this.userService.getUserById(Number(id));
  }

  @Put(':id/username')
  @ApiOperation({
    summary: '사용자 이름 수정',
    description: '지정된 ID의 사용자 이름을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '수정된 사용자 정보',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '사용자를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 사용자 이름',
  })
  async updateUsername(
    @Param('id') id: string,
    @Body() usernameUpdateDto: UsernameUpdateDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`사용자 이름 수정 요청. ID: ${id}`);
    return await this.userService.updateUsername(Number(id), usernameUpdateDto);
  }
}
// @Get(':id/posts')
// @ApiOperation({
//   summary: '특정 사용자의 게시글 조회',
//   description: '지정된 ID의 사용자가 작성한 게시글을 조회합니다.',
// })
// @ApiParam({ name: 'id', description: '사용자 ID' })
// @ApiResponse({
//   status: 200,
//   description: '사용자의 게시글 목록',
//   type: [PostBriefDto],
// })
// getUserPosts(@Param('id') id: string): PostBriefDto[] {
//   // 구현 내용
//   return [];
// }

// 사용자 위치 인증?
