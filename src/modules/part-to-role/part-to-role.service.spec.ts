import { Test, TestingModule } from '@nestjs/testing';
import { PartToRoleService } from './part-to-role.service';

describe('PartToRoleService', () => {
  let service: PartToRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartToRoleService],
    }).compile();

    service = module.get<PartToRoleService>(PartToRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
