import { Test, TestingModule } from '@nestjs/testing';
import { CiiService } from './cii.service';

describe('CiiService', () => {
  let service: CiiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiiService],
    }).compile();

    service = module.get<CiiService>(CiiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
