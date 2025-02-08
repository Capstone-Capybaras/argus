import { Test, TestingModule } from '@nestjs/testing';
import { TtpUsedService } from './ttp-used.service';

describe('TtpUsedService', () => {
  let service: TtpUsedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TtpUsedService],
    }).compile();

    service = module.get<TtpUsedService>(TtpUsedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
