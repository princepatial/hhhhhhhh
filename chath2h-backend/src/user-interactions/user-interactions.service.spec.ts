import { Test, TestingModule } from '@nestjs/testing';
import { SingleNeedService } from './user-interactions.service';

describe('SingleNeedService', () => {
  let service: SingleNeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingleNeedService],
    }).compile();

    service = module.get<SingleNeedService>(SingleNeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
