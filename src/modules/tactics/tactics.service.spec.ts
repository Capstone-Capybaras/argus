import { Test, TestingModule } from '@nestjs/testing';
import { TacticsService } from './tactics.service';

describe('TacticsService', () => {
  let service: TacticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TacticsService],
    }).compile();

    service = module.get<TacticsService>(TacticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
