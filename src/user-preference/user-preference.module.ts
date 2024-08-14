import { Module } from '@nestjs/common';
import { UserPreferenceService } from './user-preference.service';
import { UserPreferenceController } from './user-preference.controller';

@Module({
  providers: [UserPreferenceService],
  controllers: [UserPreferenceController],
})
export class UserPreferenceModule {}
