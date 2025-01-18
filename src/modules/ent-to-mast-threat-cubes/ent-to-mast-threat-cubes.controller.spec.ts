import { Test, TestingModule } from '@nestjs/testing';
import { EntToMastThreatCubesController } from './ent-to-mast-threat-cubes.controller';

describe('EntToMastThreatCubesController', () => {
  let controller: EntToMastThreatCubesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntToMastThreatCubesController],
    }).compile();

    controller = module.get<EntToMastThreatCubesController>(
      EntToMastThreatCubesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
