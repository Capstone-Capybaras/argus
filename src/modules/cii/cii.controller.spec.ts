import { Test, TestingModule } from '@nestjs/testing';
import { CiiController } from './cii.controller';

describe('CiiController', () => {
  let controller: CiiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiiController],
    }).compile();

    controller = module.get<CiiController>(CiiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
