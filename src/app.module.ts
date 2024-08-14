import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger.config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { LocationController } from './location/location.controller';
import { LocationModule } from './location/location.module';
import { TagModule } from './tag/tag.module';
import { FriendshipModule } from './friendship/friendship.module';
import { UserPreferenceModule } from './user-preference/user-preference.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    PostModule,
    ChatModule,
    ReviewModule,
    AuthModule,
    LocationModule,
    TagModule,
    FriendshipModule,
    UserPreferenceModule,
  ],
  controllers: [AppController, LocationController],
  providers: [AppService],
})
export class AppModule {}
