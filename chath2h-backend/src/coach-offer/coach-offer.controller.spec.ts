import { Test, TestingModule } from '@nestjs/testing';
import { CoachOfferController } from './coach-offer.controller';

describe('CoachOfferController', () => {
  let controller: CoachOfferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachOfferController],
    }).compile();

    controller = module.get<CoachOfferController>(CoachOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
