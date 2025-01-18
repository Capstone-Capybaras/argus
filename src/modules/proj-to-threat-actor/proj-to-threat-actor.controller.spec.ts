import { Test, TestingModule } from '@nestjs/testing';
import { ProjToThreatActorController } from './proj-to-threat-actor.controller';

describe('ProjToThreatActorController', () => {
  let controller: ProjToThreatActorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjToThreatActorController],
    }).compile();

    controller = module.get<ProjToThreatActorController>(
      ProjToThreatActorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
