import { Test, TestingModule } from '@nestjs/testing';
import { MtcToThreatActorController } from './mtc-to-threat-actor.controller';

describe('MtcToThreatActorController', () => {
  let controller: MtcToThreatActorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MtcToThreatActorController],
    }).compile();

    controller = module.get<MtcToThreatActorController>(
      MtcToThreatActorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
