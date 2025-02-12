import { Test, TestingModule } from '@nestjs/testing';
import { ServerSelectorService } from './server-selector.service';

describe('ServerSelectorService', () => {
  let service: ServerSelectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerSelectorService],
    }).compile();

    service = module.get<ServerSelectorService>(ServerSelectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
