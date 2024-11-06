import { Test, TestingModule } from '@nestjs/testing';
import { MagicLinkCreatorService } from './base-magic-link-generator';

describe('MagicLinkCreatorService', () => {
  let service: MagicLinkCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagicLinkCreatorService],
    }).compile();

    service = module.get<MagicLinkCreatorService>(MagicLinkCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
