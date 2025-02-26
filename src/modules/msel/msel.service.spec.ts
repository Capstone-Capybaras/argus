import { Test, TestingModule } from '@nestjs/testing';
import { MselService } from './msel.service';

describe('MselService', () => {
  let service: MselService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MselService],
    }).compile();

    service = module.get<MselService>(MselService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
