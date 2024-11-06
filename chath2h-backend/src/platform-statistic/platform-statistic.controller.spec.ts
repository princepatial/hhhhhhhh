import { Test, TestingModule } from '@nestjs/testing';
import { PlatformStatisticController } from './platform-statistic.controller';

describe('PlatformStatisticController', () => {
  let controller: PlatformStatisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformStatisticController],
    }).compile();

    controller = module.get<PlatformStatisticController>(
      PlatformStatisticController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
