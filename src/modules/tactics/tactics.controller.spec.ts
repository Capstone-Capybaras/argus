import { Test, TestingModule } from '@nestjs/testing';
import { TacticsController } from './tactics.controller';

describe('TacticsController', () => {
  let controller: TacticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TacticsController],
    }).compile();

    controller = module.get<TacticsController>(TacticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
