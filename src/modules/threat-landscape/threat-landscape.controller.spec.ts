import { Test, TestingModule } from '@nestjs/testing';
import { ThreatLandscapeController } from './threat-landscape.controller';

describe('ThreatLandscapeController', () => {
  let controller: ThreatLandscapeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreatLandscapeController],
    }).compile();

    controller = module.get<ThreatLandscapeController>(
      ThreatLandscapeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
