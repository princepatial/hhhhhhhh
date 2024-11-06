import { Test, TestingModule } from '@nestjs/testing';
import { CoachOfferService } from './coach-offer.service';

describe('CoachOfferService', () => {
  let service: CoachOfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachOfferService],
    }).compile();

    service = module.get<CoachOfferService>(CoachOfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
