import { Test, TestingModule } from '@nestjs/testing';
import { ThreatActorController } from './threat-actor.controller';

describe('ThreatActorController', () => {
  let controller: ThreatActorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreatActorController],
    }).compile();

    controller = module.get<ThreatActorController>(ThreatActorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
