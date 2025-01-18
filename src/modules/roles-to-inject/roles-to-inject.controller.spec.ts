import { Test, TestingModule } from '@nestjs/testing';
import { RolesToInjectController } from './roles-to-inject.controller';

describe('RolesToInjectController', () => {
  let controller: RolesToInjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesToInjectController],
    }).compile();

    controller = module.get<RolesToInjectController>(RolesToInjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
