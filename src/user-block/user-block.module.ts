import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from 'src/entities/user-block.entity';
import { BlockService } from './user-block.service';
import { BlockController } from './user-block.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserBlock])],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
