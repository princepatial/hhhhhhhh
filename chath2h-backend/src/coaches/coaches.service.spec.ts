import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from './coaches.service';

describe('CoachService', () => {
  let service: CoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachService],
    }).compile();

    service = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
