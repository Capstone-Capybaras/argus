import { Test, TestingModule } from '@nestjs/testing';
import { PartToRoleController } from './part-to-role.controller';

describe('PartToRoleController', () => {
  let controller: PartToRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartToRoleController],
    }).compile();

    controller = module.get<PartToRoleController>(PartToRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
