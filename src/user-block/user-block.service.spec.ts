import { Test, TestingModule } from '@nestjs/testing';
import { UserBlockService } from './user-block.service';

describe('UserBlockService', () => {
  let service: UserBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBlockService],
    }).compile();

    service = module.get<UserBlockService>(UserBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
