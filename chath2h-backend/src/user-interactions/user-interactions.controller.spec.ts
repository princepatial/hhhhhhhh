import { Test, TestingModule } from '@nestjs/testing';
import { SingleNeedController } from './user-interactions.controller';
import { SingleNeedService } from './user-interactions.service';

describe('SingleNeedController', () => {
  let controller: SingleNeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingleNeedController],
      providers: [SingleNeedService],
    }).compile();

    controller = module.get<SingleNeedController>(SingleNeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
