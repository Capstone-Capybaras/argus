import { Test, TestingModule } from '@nestjs/testing';
import { RolesToInjectService } from './roles-to-inject.service';

describe('RolesToInjectService', () => {
  let service: RolesToInjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesToInjectService],
    }).compile();

    service = module.get<RolesToInjectService>(RolesToInjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
