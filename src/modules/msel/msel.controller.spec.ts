import { Test, TestingModule } from '@nestjs/testing';
import { MselController } from './msel.controller';

describe('MselController', () => {
  let controller: MselController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MselController],
    }).compile();

    controller = module.get<MselController>(MselController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
