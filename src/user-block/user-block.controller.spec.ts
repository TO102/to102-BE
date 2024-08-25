import { Test, TestingModule } from '@nestjs/testing';
import { UserBlockController } from './user-block.controller';

describe('UserBlockController', () => {
  let controller: UserBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBlockController],
    }).compile();

    controller = module.get<UserBlockController>(UserBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
