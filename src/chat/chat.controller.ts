import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateChatDto,
  ChatResponseDto,
  CreateMessageDto,
  MessageResponseDto,
} from './dto/chat.dto';

@ApiTags('채팅')
@Controller('chats')
export class ChatController {
  @Post()
  @ApiOperation({
    summary: '새 채팅방 생성',
    description: '새로운 채팅방을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '채팅방 생성 성공',
    type: ChatResponseDto,
  })
  createChat(@Body() createChatDto: CreateChatDto): ChatResponseDto {
    // 구현 내용
    return {} as ChatResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: '사용자의 모든 채팅방 조회',
    description: '현재 사용자의 모든 채팅방을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '채팅방 목록',
    type: [ChatResponseDto],
  })
  getAllChats(): ChatResponseDto[] {
    // 구현 내용
    return [];
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 채팅방 조회',
    description: '지정된 ID의 채팅방을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '채팅방 ID' })
  @ApiResponse({
    status: 200,
    description: '채팅방 정보',
    type: ChatResponseDto,
  })
  getChatById(@Param('id') id: string): ChatResponseDto {
    // 구현 내용
    return {} as ChatResponseDto;
  }

  @Post(':id/messages')
  @ApiOperation({
    summary: '채팅 메시지 전송',
    description: '지정된 채팅방에 새 메시지를 전송합니다.',
  })
  @ApiParam({ name: 'id', description: '채팅방 ID' })
  @ApiResponse({
    status: 201,
    description: '메시지 전송 성공',
    type: MessageResponseDto,
  })
  sendMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ): MessageResponseDto {
    // 구현 내용
    return {} as MessageResponseDto;
  }

  @Get(':id/messages')
  @ApiOperation({
    summary: '채팅방의 메시지 조회',
    description: '지정된 채팅방의 모든 메시지를 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '채팅방 ID' })
  @ApiResponse({
    status: 200,
    description: '메시지 목록',
    type: [MessageResponseDto],
  })
  getMessages(@Param('id') id: string): MessageResponseDto[] {
    // 구현 내용
    return [];
  }
}
