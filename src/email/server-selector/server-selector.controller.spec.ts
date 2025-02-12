import { Test, TestingModule } from '@nestjs/testing';
import { ServerSelectorController } from './server-selector.controller';

describe('ServerSelectorController', () => {
  let controller: ServerSelectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerSelectorController],
    }).compile();

    controller = module.get<ServerSelectorController>(ServerSelectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
