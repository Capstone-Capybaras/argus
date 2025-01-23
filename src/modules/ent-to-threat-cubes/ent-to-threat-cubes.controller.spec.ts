import { Test, TestingModule } from '@nestjs/testing';
import { EntToThreatCubesController } from './ent-to-threat-cubes.controller';

describe('EntToThreatCubesController', () => {
  let controller: EntToThreatCubesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntToThreatCubesController],
    }).compile();

    controller = module.get<EntToThreatCubesController>(
      EntToThreatCubesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
