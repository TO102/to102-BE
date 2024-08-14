import { ApiProperty, PickType } from '@nestjs/swagger';

export class Chat {
  @ApiProperty({ example: 1, description: '채팅방 고유 식별자' })
  id: number;

  @ApiProperty({ example: 1, description: '채팅방 생성자 ID' })
  creatorId: number;

  @ApiProperty({ example: 2, description: '채팅 상대방 ID' })
  participantId: number;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '채팅방 생성 시간',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-13T12:30:00Z',
    description: '마지막 메시지 시간',
  })
  lastMessageAt: Date;
}

export class Message {
  @ApiProperty({ example: 1, description: '메시지 고유 식별자' })
  id: number;

  @ApiProperty({ example: 1, description: '채팅방 ID' })
  chatId: number;

  @ApiProperty({ example: 1, description: '메시지 발신자 ID' })
  senderId: number;

  @ApiProperty({ example: '안녕하세요!', description: '메시지 내용' })
  content: string;

  @ApiProperty({
    example: '2023-08-13T12:00:00Z',
    description: '메시지 전송 시간',
  })
  sentAt: Date;
}

export class CreateChatDto extends PickType(Chat, ['participantId'] as const) {}

export class ChatResponseDto extends Chat {}

export class CreateMessageDto extends PickType(Message, ['content'] as const) {}

export class MessageResponseDto extends Message {}
