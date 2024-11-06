import { Test, TestingModule } from '@nestjs/testing';
import { PlatformStatisticService } from './platform-statistic.service';

describe('PlatformStatisticService', () => {
  let service: PlatformStatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformStatisticService],
    }).compile();

    service = module.get<PlatformStatisticService>(PlatformStatisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
