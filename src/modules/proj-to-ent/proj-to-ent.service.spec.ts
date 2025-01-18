import { Test, TestingModule } from '@nestjs/testing';
import { ProjToEntService } from './proj-to-ent.service';

describe('ProjToEntService', () => {
  let service: ProjToEntService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjToEntService],
    }).compile();

    service = module.get<ProjToEntService>(ProjToEntService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
