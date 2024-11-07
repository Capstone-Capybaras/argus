import { Test, TestingModule } from '@nestjs/testing';
import { InjectsService } from './injects.service';

describe('InjectsService', () => {
  let service: InjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InjectsService],
    }).compile();

    service = module.get<InjectsService>(InjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
