import { Test, TestingModule } from '@nestjs/testing';
import { MasterThreatCubesController } from './master-threat-cubes.controller';

describe('MasterThreatCubesController', () => {
  let controller: MasterThreatCubesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterThreatCubesController],
    }).compile();

    controller = module.get<MasterThreatCubesController>(
      MasterThreatCubesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
