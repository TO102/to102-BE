import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { User } from './entities/user.entity';
import { UserLocation } from './entities/user-location.entity';
import { UserPreference } from './entities/user-preference.entity';
import { Post } from './entities/post.entity';
import { PostTag } from './entities/post-tag.entity';
import { Tag } from './entities/tag.entity';
import { Review } from './entities/review.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { Friendship } from './entities/friendship.entity';
import { Location } from './entities/location.entity';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    UserLocation,
    UserPreference,
    Post,
    PostTag,
    Tag,
    Review,
    ChatRoom,
    Message,
    Friendship,
    Location,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  ssl:
    configService.get('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
  logging: true,
  logger: 'advanced-console',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
