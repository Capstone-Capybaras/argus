import { Test, TestingModule } from '@nestjs/testing';
import { ProjToEntController } from './proj-to-ent.controller';

describe('ProjToEntController', () => {
  let controller: ProjToEntController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjToEntController],
    }).compile();

    controller = module.get<ProjToEntController>(ProjToEntController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
